import { useMemo } from 'react';

import { components } from '../../client/apiSchema.generated';
import { isAuthorizedTo, isLanguagePermitted } from '../../tools/permissions';

type ApiKeyPermissionsModel = components['schemas']['ApiKeyPermissionsModel'];
type LanguageModel = components['schemas']['LanguageModel'];

export const getComputedPermissions = (
  permissions: ApiKeyPermissionsModel | undefined,
  keyExists: boolean | undefined,
  availableLanguages: LanguageModel[] | undefined
) => {
  const has = (scope: string) => isAuthorizedTo(scope, permissions?.scopes);

  const canCreateKey = has('keys.create');

  // if key doesn't exist and we don't have permission to create it's useless to change anything in the form
  const keyCreationOk = keyExists || canCreateKey;

  const canEditTranslations = has('translations.edit') && keyCreationOk;
  const canEditStates = has('translations.state-edit') && keyCreationOk;
  const canEditTags = has('keys.edit') && keyCreationOk;
  const canEditPlural = has('keys.edit') && keyCreationOk;
  const canViewScreenshots = has('screenshots.view');
  const canUploadScreenshots = has('screenshots.upload') && keyCreationOk;
  const canDeleteScreenshots = has('screenshots.delete') && keyCreationOk;
  const canSendBigMeta = has('translations.edit');

  const canSubmitForm =
    canEditTranslations ||
    canEditStates ||
    canEditTags ||
    canUploadScreenshots ||
    canDeleteScreenshots;

  const getLanguageId = (language: string) => {
    return availableLanguages?.find((l) => l.tag === language)?.id;
  };

  const canEditTranslation = (language: string) => {
    return (
      canEditTranslations &&
      isLanguagePermitted(
        getLanguageId(language),
        permissions?.translateLanguageIds
      )
    );
  };

  const canEditState = (language: string) => {
    return (
      canEditStates &&
      isLanguagePermitted(
        getLanguageId(language),
        permissions?.stateChangeLanguageIds
      )
    );
  };

  return {
    canEditTags,
    canViewScreenshots,
    canUploadScreenshots,
    canDeleteScreenshots,
    canSubmitForm,
    canSendBigMeta,
    canEditPlural,
    canEditState,
    canEditTranslation,
  };
};

export const useComputedPermissions = (
  permissions: ApiKeyPermissionsModel | undefined,
  keyExists: boolean | undefined,
  availableLanguages: LanguageModel[] | undefined
) => {
  return useMemo(
    () => getComputedPermissions(permissions, keyExists, availableLanguages),
    [permissions, keyExists, availableLanguages]
  );
};
