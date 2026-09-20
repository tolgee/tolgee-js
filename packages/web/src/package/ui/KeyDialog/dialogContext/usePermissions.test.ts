import { components } from '../../client/apiSchema.generated';
import { getComputedPermissions } from './usePermissions';

type ApiKeyPermissionsModel = components['schemas']['ApiKeyPermissionsModel'];
type LanguageModel = components['schemas']['LanguageModel'];
type KeyWithTranslationsModel =
  components['schemas']['KeyWithTranslationsModel'];

const languages = [
  { id: 1, tag: 'en' },
  { id: 2, tag: 'cs' },
] as LanguageModel[];

const existingKey = {
  keyId: 1,
  tasks: [],
} as unknown as KeyWithTranslationsModel;

const keyWithTask = (type: 'TRANSLATE' | 'REVIEW') =>
  ({
    keyId: 1,
    tasks: [{ languageTag: 'cs', userAssigned: true, type }],
  }) as unknown as KeyWithTranslationsModel;

const permissions = (overrides: Partial<ApiKeyPermissionsModel>) =>
  ({
    scopes: [],
    suggestionsMode: 'ENABLED',
    translationProtection: 'NONE',
    ...overrides,
  }) as ApiKeyPermissionsModel;

const compute = (
  overrides: Partial<ApiKeyPermissionsModel>,
  keyData: KeyWithTranslationsModel | undefined = existingKey
) => getComputedPermissions(permissions(overrides), keyData, languages);

describe('canSuggestTranslation', () => {
  it('is limited to the languages the user may suggest in', () => {
    const result = compute({
      scopes: ['translations.suggest'],
      suggestLanguageIds: [2],
    });
    expect(result.canSuggestTranslation('cs')).toBe(true);
    expect(result.canSuggestTranslation('en')).toBe(false);
  });

  it('is off without the suggest scope', () => {
    const result = compute({ scopes: ['translations.view'] });
    expect(result.canSuggestTranslation('cs')).toBe(false);
  });

  it('is off when the project has suggestions disabled', () => {
    const result = compute({
      scopes: ['translations.suggest'],
      suggestionsMode: 'DISABLED',
    });
    expect(result.canSuggestTranslation('cs')).toBe(false);
  });

  it('is off against an older server that does not report the mode', () => {
    const result = compute({
      scopes: ['translations.suggest'],
      suggestionsMode: undefined,
    });
    expect(result.canSuggestTranslation('cs')).toBe(false);
  });

  it('is off for a key that does not exist yet', () => {
    const result = getComputedPermissions(
      permissions({ scopes: ['translations.suggest'] }),
      undefined,
      languages
    );
    expect(result.canSuggestTranslation('cs')).toBe(false);
  });
});

describe('getDisposition', () => {
  it('saves where the language is editable and suggests elsewhere', () => {
    const result = compute({
      scopes: ['translations.edit', 'translations.suggest'],
      translateLanguageIds: [1],
    });
    expect(result.getDisposition('en', 'TRANSLATED')).toBe('save');
    expect(result.getDisposition('cs', 'TRANSLATED')).toBe('suggest');
  });

  it('is readonly with neither edit nor suggest', () => {
    const result = compute({ scopes: ['translations.view'] });
    expect(result.getDisposition('cs', 'TRANSLATED')).toBe('readonly');
  });

  it('turns a protected reviewed translation into a suggestion', () => {
    const result = compute({
      scopes: ['translations.edit', 'translations.suggest'],
      translationProtection: 'PROTECT_REVIEWED',
    });
    expect(result.getDisposition('cs', 'REVIEWED')).toBe('suggest');
    expect(result.getDisposition('cs', 'TRANSLATED')).toBe('save');
  });

  it('is readonly on a protected reviewed translation when suggesting is not possible', () => {
    const result = compute({
      scopes: ['translations.edit'],
      translationProtection: 'PROTECT_REVIEWED',
    });
    expect(result.getDisposition('cs', 'REVIEWED')).toBe('readonly');
  });

  it('lets a reviewer save over a protected reviewed translation', () => {
    const result = compute({
      scopes: ['translations.edit', 'translations.state-edit'],
      translationProtection: 'PROTECT_REVIEWED',
    });
    expect(result.getDisposition('cs', 'REVIEWED')).toBe('save');
  });

  it('does not protect reviewed translations against an older server that does not report protection', () => {
    const result = compute({
      scopes: ['translations.edit'],
      translationProtection: undefined,
    });
    expect(result.getDisposition('cs', 'REVIEWED')).toBe('save');
  });

  it('lets a translate-task assignee save, but not over a protected reviewed translation', () => {
    const result = compute(
      { scopes: [], translationProtection: 'PROTECT_REVIEWED' },
      keyWithTask('TRANSLATE')
    );
    expect(result.getDisposition('cs', 'TRANSLATED')).toBe('save');
    expect(result.getDisposition('cs', 'REVIEWED')).toBe('readonly');
  });

  it('lets an editor assigned to a review task save over a protected reviewed translation', () => {
    const result = compute(
      {
        scopes: ['translations.edit'],
        translationProtection: 'PROTECT_REVIEWED',
      },
      keyWithTask('REVIEW')
    );
    expect(result.getDisposition('cs', 'REVIEWED')).toBe('save');
  });
});

describe('canSubmitForm', () => {
  it('is true for a user who can only suggest', () => {
    expect(
      compute({ scopes: ['translations.suggest'] }).canSubmitForm
    ).toBeTruthy();
  });

  it('stays false for a view-only user', () => {
    expect(
      compute({ scopes: ['translations.view'] }).canSubmitForm
    ).toBeFalsy();
  });
});

describe('suggestion actions', () => {
  const allSuggestionActionScopes: ApiKeyPermissionsModel['scopes'] = [
    'translation-suggestions.own-access',
    'translation-suggestions.manage',
    'translations.state-edit',
  ];

  it('maps each action to its scope and language restriction', () => {
    const result = compute({
      scopes: allSuggestionActionScopes,
      suggestManageLanguageIds: [1],
      stateChangeLanguageIds: [2],
    });
    expect(result.canDeleteOwnSuggestion).toBe(true);
    expect(result.canModerateSuggestions('en')).toBe(true);
    expect(result.canModerateSuggestions('cs')).toBe(false);
    expect(result.canReviewSuggestions('cs')).toBe(true);
    expect(result.canReviewSuggestions('en')).toBe(false);
  });

  it('are all off against an older server that does not report the mode', () => {
    const result = compute({
      scopes: allSuggestionActionScopes,
      suggestionsMode: undefined,
    });
    expect(result.canDeleteOwnSuggestion).toBe(false);
    expect(result.canModerateSuggestions('cs')).toBe(false);
    expect(result.canReviewSuggestions('cs')).toBe(false);
  });

  it('are all off when suggestions are disabled', () => {
    const result = compute({
      scopes: allSuggestionActionScopes,
      suggestionsMode: 'DISABLED',
    });
    expect(result.canDeleteOwnSuggestion).toBe(false);
    expect(result.canModerateSuggestions('cs')).toBe(false);
    expect(result.canReviewSuggestions('cs')).toBe(false);
  });
});
