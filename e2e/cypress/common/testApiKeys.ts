import { ApiKeyPermissionsModel } from './simulateReqAndResponse';

const project: ApiKeyPermissionsModel['project'] = {
  id: 1,
  name: 'Test',
  icuPlaceholders: true,
};

const heldByBoth = (scopes: ApiKeyPermissionsModel['scopes']) => ({
  userScopes: scopes,
  scopes,
});

export const fullPermissions: ApiKeyPermissionsModel = {
  projectId: 1,
  project,
  viewLanguageIds: null,
  translateLanguageIds: null,
  stateChangeLanguageIds: null,
  suggestionsMode: 'DISABLED',
  translationProtection: 'NONE',
  userId: 1,
  ...heldByBoth([
    'keys.create',
    'keys.edit',
    'translations.view',
    'translations.edit',
    'translations.state-edit',
    'screenshots.view',
    'screenshots.delete',
    'screenshots.upload',
  ]),
};

export const translateEnglish: ApiKeyPermissionsModel = {
  projectId: 1,
  project,
  viewLanguageIds: null,
  translateLanguageIds: [1000000001],
  stateChangeLanguageIds: null,
  suggestionsMode: 'DISABLED',
  translationProtection: 'NONE',
  userId: 1,
  ...heldByBoth(['translations.view', 'translations.edit', 'screenshots.view']),
};

export const changeStateEnglish: ApiKeyPermissionsModel = {
  projectId: 1,
  project,
  viewLanguageIds: null,
  translateLanguageIds: null,
  stateChangeLanguageIds: [1000000001],
  suggestionsMode: 'DISABLED',
  translationProtection: 'NONE',
  userId: 1,
  ...heldByBoth([
    'translations.view',
    'screenshots.view',
    'translations.state-edit',
  ]),
};

export const suggestOnly: ApiKeyPermissionsModel = {
  projectId: 1,
  project,
  viewLanguageIds: null,
  translateLanguageIds: null,
  stateChangeLanguageIds: null,
  suggestLanguageIds: null,
  suggestionsMode: 'ENABLED',
  translationProtection: 'NONE',
  userId: 1,
  ...heldByBoth([
    'translations.view',
    'translations.suggest',
    'screenshots.view',
  ]),
};

export const translateEnglishSuggestRest: ApiKeyPermissionsModel = {
  ...suggestOnly,
  translateLanguageIds: [1000000001],
  ...heldByBoth([...suggestOnly.scopes, 'translations.edit']),
};

export const viewOnlyKeyOfEditor: ApiKeyPermissionsModel = {
  ...suggestOnly,
  suggestionsMode: 'DISABLED',
  userScopes: ['translations.view', 'translations.edit', 'screenshots.view'],
  scopes: ['translations.view', 'screenshots.view'],
};

export const editEnglishSuggestRestWithTags: ApiKeyPermissionsModel = {
  ...fullPermissions,
  suggestionsMode: 'ENABLED',
  translateLanguageIds: [1000000001],
  ...heldByBoth([...fullPermissions.scopes, 'translations.suggest']),
};

export const editorOnProtectedProject: ApiKeyPermissionsModel = {
  ...fullPermissions,
  suggestionsMode: 'ENABLED',
  translationProtection: 'PROTECT_REVIEWED',
  ...heldByBoth([...suggestOnly.scopes, 'translations.edit', 'keys.edit']),
};

export const suggestGermanKeyOfEditor: ApiKeyPermissionsModel = {
  ...suggestOnly,
  suggestLanguageIds: [1000000000],
  userScopes: [...suggestOnly.scopes, 'translations.edit'],
};
