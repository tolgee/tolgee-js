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
  scopes: ['translations.view', 'translations.edit', 'screenshots.view'],
};

export const changeStateEnglish: ApiKeyPermissionsModel = {
  projectId: 1,
  project,
  viewLanguageIds: null,
  translateLanguageIds: null,
  stateChangeLanguageIds: [1000000001],
  scopes: ['translations.view', 'screenshots.view', 'translations.state-edit'],
};
