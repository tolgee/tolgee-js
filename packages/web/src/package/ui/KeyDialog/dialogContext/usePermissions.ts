import { useMemo } from 'react';

import { components } from '../../client/apiSchema.generated';
import { isAuthorizedTo, isLanguagePermitted } from '../../tools/permissions';

type ApiKeyPermissionsModel = components['schemas']['ApiKeyPermissionsModel'];
type LanguageModel = components['schemas']['LanguageModel'];
type KeyWithTranslationsModel =
  components['schemas']['KeyWithTranslationsModel'];

export const getComputedPermissions = (
  permissions: ApiKeyPermissionsModel | undefined,
  keyData: KeyWithTranslationsModel | undefined,
  availableLanguages: LanguageModel[] | undefined
) => {
  const has = (scope: string) => isAuthorizedTo(scope, permissions?.scopes);
  const keyExists = Boolean(keyData);

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
  const isAssignedToTranslation = keyData?.tasks?.find((i) => i?.userAssigned);

  const canSubmitForm =
    canEditTranslations ||
    canEditStates ||
    canEditTags ||
    canUploadScreenshots ||
    canDeleteScreenshots ||
    isAssignedToTranslation;

  const getLanguageId = (language: string) => {
    return availableLanguages?.find((l) => l.tag === language)?.id;
  };

  const canEditTranslation = (language: string) => {
    const firstTask = keyData?.tasks?.find((t) => t.languageTag === language);
    return (
      (canEditTranslations &&
        isLanguagePermitted(
          getLanguageId(language),
          permissions?.translateLanguageIds
        )) ||
      (firstTask?.userAssigned && firstTask.type === 'TRANSLATE')
    );
  };

  const canEditState = (language: string) => {
    const firstTask = keyData?.tasks?.find((t) => t.languageTag === language);
    return (
      (canEditStates &&
        isLanguagePermitted(
          getLanguageId(language),
          permissions?.stateChangeLanguageIds
        )) ||
      (firstTask?.userAssigned && firstTask.type === 'REVIEW')
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
  keyData: KeyWithTranslationsModel | undefined,
  availableLanguages: LanguageModel[] | undefined
) => {
  return useMemo(
    () => getComputedPermissions(permissions, keyData, availableLanguages),
    [permissions, keyData, availableLanguages]
  );
};
