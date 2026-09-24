import { MAX_LANGUAGES_SELECTED } from '../../../constants';
import {
  getInitialLanguages,
  permissionsQueryProjectId,
  sameTranslation,
  isSuggestOnly,
  keepFormFields,
  planSubmit,
  setPreferredLanguages,
} from './tools';

// See decodeApiKey.test.ts for how a tgpak's embedded project id is decoded.
const PAK_FOR_PROJECT_1 = 'tgpak_gfpxm4lin4zdazleoq4gm2rumfxgi2lfom2gw4dpguzxc';

describe('permissionsQueryProjectId', () => {
  it('leaves the project to the key itself for a PAK, whatever the site configures', () => {
    expect(
      permissionsQueryProjectId({ apiKey: PAK_FOR_PROJECT_1, projectId: 9 })
    ).toBeUndefined();
  });

  it('uses the configured project for a PAT', () => {
    expect(
      permissionsQueryProjectId({ apiKey: 'tgpat_x', projectId: '9' })
    ).toBe(9);
  });

  it('uses the configured project for the extension transport', () => {
    expect(
      permissionsQueryProjectId({ transport: jest.fn(), projectId: '9' })
    ).toBe(9);
  });

  it('sends no project when none is known', () => {
    expect(permissionsQueryProjectId({ apiKey: 'tgpat_x' })).toBeUndefined();
  });
});

describe('getInitialLanguages', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('puts the base language first in the fallback selection', () => {
    const available = ['de', 'fr', 'en'];
    expect(getInitialLanguages(available, 'en')).toEqual(['en', 'de', 'fr']);
  });

  it('caps the selection to MAX_LANGUAGES_SELECTED', () => {
    const available = ['en', ...Array.from({ length: 10 }, (_, i) => `l${i}`)];
    expect(getInitialLanguages(available, 'en')).toHaveLength(
      MAX_LANGUAGES_SELECTED
    );
  });

  it('includes the base language by default even when it sorts past the cap', () => {
    const rawTags = ['ar', 'ar-PS', 'ar-SA', 'az', 'cs', 'de', 'en', 'es'];
    const selected = getInitialLanguages(rawTags, 'en');
    expect(selected[0]).toBe('en');
    expect(selected).toHaveLength(MAX_LANGUAGES_SELECTED);
  });

  it('keeps the base language on top when a stored preference includes it past the cap', () => {
    setPreferredLanguages(['ar', 'ar-PS', 'ar-SA', 'az', 'cs', 'en']);
    const rawTags = ['ar', 'ar-PS', 'ar-SA', 'az', 'cs', 'en'];
    const selected = getInitialLanguages(rawTags, 'en');
    expect(selected[0]).toBe('en');
    expect(selected).toHaveLength(MAX_LANGUAGES_SELECTED);
  });

  it('respects an explicit deselection of the base language', () => {
    setPreferredLanguages(['cs', 'de']);
    const rawTags = ['ar', 'cs', 'de', 'en'];
    expect(getInitialLanguages(rawTags, 'en')).toEqual(['cs', 'de']);
  });

  it('does not duplicate the base language when it is already preferred', () => {
    setPreferredLanguages(['en', 'cs']);
    const rawTags = ['ar', 'cs', 'de', 'en'];
    expect(getInitialLanguages(rawTags, 'en')).toEqual(['en', 'cs']);
  });
});

describe('planSubmit', () => {
  const field = (
    language: string,
    disposition: 'save' | 'suggest' | 'readonly',
    { changed = true, isEmpty = false } = {}
  ) => ({ language, disposition, changed, isEmpty });
  const unchanged = { changed: false };

  it('saves when every changed field is savable', () => {
    expect(
      planSubmit({
        fields: [field('en', 'save'), field('de', 'suggest', unchanged)],
        suggestOnly: false,
      })
    ).toEqual({ toSuggest: [], toSave: ['en'], cleared: [], kind: 'save' });
  });

  it('suggests when every changed field is a suggestion', () => {
    expect(
      planSubmit({
        fields: [field('en', 'save', unchanged), field('de', 'suggest')],
        suggestOnly: false,
      })
    ).toEqual({ toSuggest: ['de'], toSave: [], cleared: [], kind: 'suggest' });
  });

  it('does both for a mixed change', () => {
    expect(
      planSubmit({
        fields: [field('en', 'save'), field('de', 'suggest')],
        suggestOnly: false,
      })
    ).toEqual({
      toSuggest: ['de'],
      toSave: ['en'],
      cleared: [],
      kind: 'saveAndSuggest',
    });
  });

  it('never suggests an unchanged, emptied or read-only field', () => {
    expect(
      planSubmit({
        fields: [
          field('de', 'suggest', unchanged),
          field('fr', 'suggest', { isEmpty: true }),
          field('cs', 'readonly'),
        ],
        suggestOnly: false,
      })
    ).toEqual({ toSuggest: [], toSave: [], cleared: ['fr'], kind: 'save' });
  });

  it('is a suggest submit before anything is typed when that is all the user can do', () => {
    expect(
      planSubmit({
        fields: [field('de', 'suggest', unchanged)],
        suggestOnly: true,
      })
    ).toEqual({ toSuggest: [], toSave: [], cleared: [], kind: 'suggest' });
  });

  it('leaves an untouched savable language out of the update', () => {
    const plan = planSubmit({
      fields: [field('en', 'save', unchanged), field('de', 'suggest')],
      suggestOnly: false,
    });
    expect(plan.toSave).toEqual([]);
    expect(plan.kind).toBe('suggest');
  });

  it('updates only the savable language the user actually changed', () => {
    expect(
      planSubmit({
        fields: [
          field('en', 'save'),
          field('cs', 'save', unchanged),
          field('de', 'suggest'),
        ],
        suggestOnly: false,
      }).toSave
    ).toEqual(['en']);
  });

  it('updates every savable language when the key changes plural shape', () => {
    // the ICU of an untouched field is rewritten by the switch, though its variants are the same
    expect(
      planSubmit({
        fields: [
          field('en', 'save', unchanged),
          field('cs', 'save', unchanged),
          field('de', 'suggest', unchanged),
        ],
        suggestOnly: false,
        pluralChanged: true,
      }).toSave
    ).toEqual(['en', 'cs']);
  });

  it('updates a savable language that was emptied on purpose', () => {
    expect(
      planSubmit({
        fields: [field('en', 'save', { isEmpty: true })],
        suggestOnly: false,
      }).toSave
    ).toEqual(['en']);
  });
});

describe('isSuggestOnly', () => {
  const permissions = (over: Partial<Parameters<typeof isSuggestOnly>[0]>) => ({
    canEditTags: false,
    canUploadScreenshots: false,
    canDeleteScreenshots: false,
    canEditTranslation: () => false,
    canEditState: () => false,
    canSuggestTranslation: () => true,
    ...over,
  });

  it('holds for a user who can only suggest', () => {
    expect(isSuggestOnly(permissions({}), ['en', 'de'])).toBe(true);
  });

  it('does not hold for a view-only user', () => {
    expect(
      isSuggestOnly(permissions({ canSuggestTranslation: () => false }), ['en'])
    ).toBe(false);
  });

  it.each([
    ['tags', { canEditTags: true }],
    ['screenshot upload', { canUploadScreenshots: true }],
    ['screenshot delete', { canDeleteScreenshots: true }],
    [
      'one editable language',
      { canEditTranslation: (l: string) => l === 'en' },
    ],
    ['one reviewable language', { canEditState: (l: string) => l === 'de' }],
  ])('does not hold when the key update can carry %s', (_, over) => {
    expect(isSuggestOnly(permissions(over), ['en', 'de'])).toBe(false);
  });
});

describe('keepFormFields', () => {
  const fetched = { en: 'server en', de: 'server de' };
  const current = { en: 'typed en', de: 'typed de', cs: 'typed cs' };

  it('re-seeds everything when nothing is kept', () => {
    expect(keepFormFields(fetched, current, [])).toEqual(fetched);
  });

  it('keeps the named languages as typed and re-seeds the rest', () => {
    expect(keepFormFields(fetched, current, ['de'])).toEqual({
      en: 'server en',
      de: 'typed de',
    });
  });

  it('does not resurrect a language that is no longer shown', () => {
    expect(keepFormFields(fetched, current, ['cs'])).toEqual(fetched);
  });
});

describe('sameTranslation', () => {
  const f = (variants: Record<string, string>) => ({ variants });

  it('treats a form seeded from the server as unchanged', () => {
    expect(sameTranslation(f({ other: 'Hi' }), f({ other: 'Hi' }))).toBe(true);
  });

  it('ignores empty plural forms and their order', () => {
    expect(sameTranslation(f({ one: '', other: '' }), f({ other: '' }))).toBe(
      true
    );
    expect(
      sameTranslation(f({ other: 'x', one: 'y' }), f({ one: 'y', other: 'x' }))
    ).toBe(true);
  });

  it('sees a real edit', () => {
    expect(sameTranslation(f({ other: 'Hi' }), f({ other: 'Hello' }))).toBe(
      false
    );
    expect(sameTranslation(f({ other: 'Hi' }), undefined)).toBe(false);
  });
});
