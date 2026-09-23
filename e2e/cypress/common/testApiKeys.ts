import { ApiKeyPermissionsModel } from './simulateReqAndResponse';

const project: ApiKeyPermissionsModel['project'] = {
  id: 1,
  name: 'Test',
  icuPlaceholders: true,
};

export const fullPermissions: ApiKeyPermissionsModel = {
  projectId: 1,
  project,
  viewLanguageIds: null,
  translateLanguageIds: null,
  stateChangeLanguageIds: null,
  suggestionsMode: 'DISABLED',
  translationProtection: 'NONE',
  scopes: [
    'keys.create',
    'keys.edit',
    'translations.view',
    'translations.edit',
    'translations.state-edit',
    'screenshots.view',
    'screenshots.delete',
    'screenshots.upload',
  ],
};

export const translateEnglish: ApiKeyPermissionsModel = {
  projectId: 1,
  project,
  viewLanguageIds: null,
  translateLanguageIds: [1000000001],
  stateChangeLanguageIds: null,
  suggestionsMode: 'DISABLED',
  translationProtection: 'NONE',
  scopes: ['translations.view', 'translations.edit', 'screenshots.view'],
};

export const changeStateEnglish: ApiKeyPermissionsModel = {
  projectId: 1,
  project,
  viewLanguageIds: null,
  translateLanguageIds: null,
  stateChangeLanguageIds: [1000000001],
  suggestionsMode: 'DISABLED',
  translationProtection: 'NONE',
  scopes: ['translations.view', 'screenshots.view', 'translations.state-edit'],
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
  scopes: ['translations.view', 'translations.suggest', 'screenshots.view'],
};

export const translateEnglishSuggestRest: ApiKeyPermissionsModel = {
  ...suggestOnly,
  translateLanguageIds: [1000000001],
  scopes: [...suggestOnly.scopes, 'translations.edit'],
};
