import { MAX_LANGUAGES_SELECTED } from '../../../constants';
import {
  getInitialLanguages,
  permissionsQueryProjectId,
  setPreferredLanguages,
} from './tools';

// See decodeApiKey.test.ts for how a tgpak's embedded project id is decoded.
const PAK_FOR_PROJECT_1 = 'tgpak_gfpxm4lin4zdazleoq4gm2rumfxgi2lfom2gw4dpguzxc';

describe('permissionsQueryProjectId', () => {
  it("uses the PAK's own project even when the site configures another one", () => {
    expect(
      permissionsQueryProjectId({ apiKey: PAK_FOR_PROJECT_1, projectId: 9 })
    ).toBe(1);
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
