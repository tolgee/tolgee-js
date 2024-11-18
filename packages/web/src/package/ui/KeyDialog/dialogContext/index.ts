import { useEffect, useMemo, useState } from 'react';
import { UiProps } from '@tolgee/core';
import {
  TolgeeFormat,
  getTolgeeFormat,
  tolgeeFormatGenerateIcu,
} from '@tginternal/editor';

import { sleep } from '../../tools/sleep';
import { createProvider } from '../../tools/createProvider';
import { putBaseLangFirst, putBaseLangFirstTags } from '../languageHelpers';
import { useApiMutation, useApiQuery } from '../../client/useQueryApi';
import {
  changeInTolgeeCache,
  getInitialLanguages,
  getPreferredLanguages,
  mapPosition,
  setPreferredLanguages,
} from './tools';
import { useGallery } from './useGallery';
import { checkPlatformVersion } from '../../tools/checkPlatformVersion';
import { limitSurroundingKeys } from '../../tools/limitSurroundingKeys';
import {
  StateInType,
  STATES_FOR_UPDATE,
  StateType,
} from '../State/translationStates';
import { useComputedPermissions } from './usePermissions';
import { HttpError } from '../../client/HttpError';
import { components } from '../../client/apiSchema.generated';
import { isTranslationEmpty } from '../../tools/isTranslationEmpty';

const MINIMAL_PLATFORM_VERSION = 'v3.42.0';

type LanguageModel = components['schemas']['LanguageModel'];

type FormTranslations = {
  [key: string]: {
    value: TolgeeFormat;
    state: StateType;
  };
};

type DialogProps = {
  keyName: string;
  defaultValue: string;
  onClose: () => void;
  uiProps: UiProps;
  fallbackNamespaces: string[];
  namespace: string;
  children: React.ReactNode;
};

export const [DialogProvider, useDialogActions, useDialogContext] =
  createProvider((props: DialogProps) => {
    const [success, setSuccess] = useState<boolean>(false);
    const [translationsForm, _setTranslationsForm] = useState<FormTranslations>(
      {}
    );

    function setTranslation(language: string, value: TolgeeFormat) {
      _setTranslationsForm((val) => ({
        ...val,
        [language]: {
          ...val[language],
          value,
        },
      }));
    }

    function setState(language: string, state: StateType) {
      _setTranslationsForm((value) => ({
        ...value,
        [language]: {
          ...value[language],
          state,
        },
      }));
    }

    const [saving, setSaving] = useState(false);

    const [selectedNs, setSelectedNs] = useState<string>(props.namespace);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const [_isPlural, setIsPlural] = useState<boolean>();
    const [_pluralArgName, setPluralArgName] = useState<string>();
    const [submitError, setSubmitError] = useState<HttpError>();

    const filterTagMissing =
      Boolean(props.uiProps.filterTag?.length) &&
      tags &&
      !props.uiProps.filterTag.find((t) => tags.includes(t));
    useEffect(() => {
      // reset when key changes
      setIsPlural(undefined);
      setPluralArgName(undefined);
    }, [props.keyName, props.namespace]);

    const {
      screenshots,
      setScreenshots,
      screenshotDetail,
      setScreenshotDetail,
      screenshotsUploading,
      takingScreenshot,
      handleRemoveScreenshot,
      handleUploadImages,
      deleteImages,
      canTakeScreenshots,
      error: galleryError,
      ...galleryProps
    } = useGallery(props.uiProps);

    const scopesLoadable = useApiQuery({
      url: '/v2/api-keys/current-permissions',
      method: 'get',
      query: {
        projectId: Number(props.uiProps.projectId),
      },
    });

    const icuPlaceholders = scopesLoadable.data?.project?.icuPlaceholders;
    const pluralsSupported = icuPlaceholders !== undefined;

    const languagesLoadable = useApiQuery({
      url: '/v2/projects/languages',
      method: 'get',
      query: {
        size: 1000,
      },
      options: {
        onSuccess(data) {
          const selectedLanguages = getInitialLanguages(
            data._embedded?.languages?.map((l) => l.tag!) || []
          );
          initializeWithDefaultValue(undefined, data._embedded?.languages);
          setSelectedLanguages(selectedLanguages);
          setPreferredLanguages(selectedLanguages);
        },
      },
    });

    const createKey = useApiMutation({
      url: '/v2/projects/keys/create',
      method: 'post',
    });

    const availableLanguages = useMemo(() => {
      return putBaseLangFirst(languagesLoadable.data?._embedded?.languages);
    }, [languagesLoadable.data]);

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
      getPreferredLanguages()
    );

    const translationsLoadable = useApiQuery({
      url: '/v2/projects/translations',
      method: 'get',
      query: {
        filterKeyName: [props.keyName],
        filterNamespace: [selectedNs],
        languages: selectedLanguages,
      },
      options: {
        enabled: Boolean(scopesLoadable.data),
        keepPreviousData: true,
        onSuccess(data) {
          const result: FormTranslations = {};
          const firstKey = data._embedded?.keys?.[0];
          const isPlural = Boolean(firstKey?.keyIsPlural);
          data.selectedLanguages?.forEach((lang) => {
            const translation = firstKey?.translations[lang.tag];
            result[lang.tag] = {
              value: getTolgeeFormat(
                translation?.text || '',
                isPlural,
                !icuPlaceholders
              ),
              state: translation?.state || 'UNTRANSLATED',
            };
          });
          if (_pluralArgName === undefined && isPlural) {
            setPluralArgName(firstKey?.keyPluralArgName);
          }
          initializeWithDefaultValue(result, undefined);
          if (firstKey) {
            setTags(firstKey?.keyTags?.map((t) => t.name) || []);
          } else {
            setTags([
              ...(props.uiProps.filterTag ?? []),
              ...(props.uiProps.tagNewKeys ?? []),
            ]);
          }
          setScreenshots(
            firstKey?.screenshots?.map((sc) => ({
              ...sc,
              filename: sc.filename!,
              justUploaded: false,
            })) || []
          );
        },
      },
    });

    function initializeWithDefaultValue(
      translationData: FormTranslations | undefined,
      languagesData: LanguageModel[] | undefined
    ) {
      const data =
        translationData ??
        (translationsLoadable.isSuccess ? undefined : translationsForm);
      const languages =
        languagesData ?? languagesLoadable.data._embedded.languages;

      if (!data || !languages) {
        return undefined;
      }

      const baseLang = languages.find((l) => l.base);
      const baseLangIncluded = selectedLanguages.includes(baseLang.tag);
      const baseValueEmpty = isTranslationEmpty(
        data?.[baseLang.tag]?.value,
        isPlural
      );

      if (data && baseLangIncluded && baseValueEmpty && props.defaultValue) {
        _setTranslationsForm({
          ...data,
          [baseLang.tag]: {
            state: data?.[baseLang.tag]?.state ?? 'UNTRANSLATED',
            value: getTolgeeFormat(
              props.defaultValue,
              isPlural,
              !icuPlaceholders
            ),
          },
        });
      } else {
        _setTranslationsForm({
          ...data,
        });
      }
    }

    const keyData = translationsLoadable.data?._embedded?.keys?.[0];
    const isPlural =
      _isPlural !== undefined ? _isPlural : Boolean(keyData?.keyIsPlural);
    const pluralArgName = isPlural ? _pluralArgName || 'value' : undefined;

    const keyExists = Boolean(
      translationsLoadable.data?._embedded?.keys?.length
    );

    const permissions = useComputedPermissions(
      scopesLoadable.data,
      translationsLoadable?.data?._embedded?.keys?.[0],
      languagesLoadable.data?._embedded?.languages
    );

    const updateKey = useApiMutation({
      url: '/v2/projects/keys/{id}/complex-update',
      method: 'put',
    });

    const linkToPlatform =
      scopesLoadable.data?.projectId !== undefined
        ? `${props.uiProps.apiUrl}/projects/${
            scopesLoadable.data?.projectId
          }/translations/single?key=${props.keyName}${
            selectedNs !== undefined ? `&ns=${selectedNs}` : ''
          }`
        : undefined;

    const [container, setContainer] = useState(
      undefined as Element | undefined
    );
    const [useBrowserWindow, setUseBrowserWindow] = useState(false);

    function onInputChange(key: string, value: TolgeeFormat) {
      setSubmitError(undefined);
      setSuccess(false);
      setTranslation(key, value);
    }

    function onStateChange(key: string, value: StateType) {
      setSuccess(false);
      setState(key, value);
    }

    async function onSave() {
      setSaving(true);
      try {
        const newTranslations = {} as Record<string, string>;
        const newStates = {} as Record<string, StateInType>;
        Object.entries(translationsForm).forEach(([language, value]) => {
          const canBeTranslated = permissions.canEditTranslation(language);
          const stateCanBeChanged = permissions.canEditState(language);

          if (canBeTranslated) {
            newTranslations[language] = tolgeeFormatGenerateIcu(
              { ...value.value, parameter: pluralArgName },
              !icuPlaceholders
            );
          }
          if (
            STATES_FOR_UPDATE.includes(value.state as StateInType) &&
            keyData?.translations?.[language]?.state !== value.state &&
            stateCanBeChanged
          ) {
            newStates[language] = value.state as StateInType;
          }
        });

        const relatedKeysInOrder = permissions.canSendBigMeta
          ? limitSurroundingKeys(props.uiProps.findPositions(), {
              keyName: props.keyName,
              keyNamespace: selectedNs,
            })
          : undefined;

        await (keyData === undefined
          ? createKey.mutateAsync({
              content: {
                'application/json': {
                  name: props.keyName,
                  namespace: selectedNs || undefined,
                  translations: newTranslations,
                  states: newStates,
                  screenshots: screenshots.map((sc) => ({
                    uploadedImageId: sc.id,
                    positions: sc.keyReferences?.map(mapPosition),
                  })),
                  tags,
                  relatedKeysInOrder,
                  isPlural,
                  pluralArgName,
                },
              },
            })
          : updateKey.mutateAsync({
              content: {
                'application/json': {
                  name: props.keyName,
                  namespace: selectedNs || undefined,
                  translations: newTranslations,
                  states: newStates,
                  screenshotIdsToDelete: getRemovedScreenshots(),
                  screenshotsToAdd: getJustUploadedScreenshots().map((sc) => ({
                    uploadedImageId: sc.id,
                    positions: sc.keyReferences?.map(mapPosition),
                  })),
                  tags,
                  relatedKeysInOrder,
                  isPlural,
                  pluralArgName,
                },
              },
              path: { id: keyData.keyId! },
            }));

        changeInTolgeeCache(
          props.keyName,
          selectedNs,
          Object.entries(newTranslations),
          props.uiProps.changeTranslation
        );

        props.uiProps.onPermanentChange({
          key: props.keyName,
          namespace: selectedNs,
        });
        translationsLoadable.refetch();
        setSaving(false);
        setSuccess(true);
        if (useBrowserWindow) {
          await sleep(2000);
          setSuccess(false);
        } else {
          await sleep(400);
          props.onClose();
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e);
        setSubmitError(e);
      } finally {
        setSaving(false);
        setSuccess(false);
      }
    }

    function onClose() {
      if (screenshotDetail) {
        setScreenshotDetail(null);
      } else {
        props.onClose();
        setUseBrowserWindow(false);
        const uploadedScreenshots = getJustUploadedScreenshots();
        if (uploadedScreenshots.length) {
          deleteImages(uploadedScreenshots.map((sc) => sc.id!));
        }
        setScreenshots([]);
      }
    }

    function onSelectedLanguagesChange(languages: string[]) {
      if (languages.length) {
        setSelectedLanguages(languages);
        setPreferredLanguages(languages);
      }
    }

    useEffect(() => {
      const onKeyDown = (e: any) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      if (!useBrowserWindow) {
        window.addEventListener('keydown', onKeyDown);
        return () => {
          window.removeEventListener('keydown', onKeyDown);
        };
      }
    }, [useBrowserWindow]);

    const getJustUploadedScreenshots = () => {
      return screenshots.filter((sc) => sc.justUploaded);
    };

    const getRemovedScreenshots = () => {
      return (
        keyData?.screenshots
          ?.map((sc) => sc.id)
          .filter((scId) => !screenshots.find((sc) => sc.id === scId)) || []
      );
    };

    function handleTakeScreenshot() {
      galleryProps.handleTakeScreenshot(
        props.keyName,
        selectedNs,
        Object.entries(translationsForm).map(
          ([language, value]) =>
            [
              language,
              tolgeeFormatGenerateIcu(value.value, !icuPlaceholders),
            ] as [string, string]
        )
      );
    }

    const versionError = checkPlatformVersion(
      MINIMAL_PLATFORM_VERSION,
      translationsLoadable.data?._internal?.version
    );

    const baseLang = availableLanguages?.find(({ base }) => base);
    const loading =
      languagesLoadable.isFetching ||
      (translationsLoadable.isLoading && !translationsLoadable.data) ||
      scopesLoadable.isFetching;
    const error =
      versionError ||
      languagesLoadable.error ||
      translationsLoadable.error ||
      scopesLoadable.error ||
      createKey.error ||
      updateKey.error ||
      galleryError;

    const formDisabled = loading || !permissions.canSubmitForm;

    const contextValue = {
      input: props.keyName,
      fallbackNamespaces: props.fallbackNamespaces,
      uiProps: props.uiProps,
      selectedNs,
      loading,
      saving,
      success,
      error,
      availableLanguages,
      selectedLanguages: putBaseLangFirstTags(selectedLanguages, baseLang?.tag),
      formDisabled,
      keyData,
      translationsForm,
      container,
      useBrowserWindow,
      takingScreenshot,
      screenshotsUploading,
      screenshots,
      screenshotDetail,
      linkToPlatform,
      keyExists,
      tags: tags || [],
      permissions,
      canTakeScreenshots,
      isPlural,
      _pluralArgName,
      pluralArgName,
      pluralsSupported,
      icuPlaceholders,
      submitError,
      filterTagMissing,
    } as const;

    const actions = {
      onInputChange,
      onStateChange,
      handleUploadImages,
      handleTakeScreenshot,
      handleRemoveScreenshot,
      onSave,
      onClose,
      onSelectedLanguagesChange,
      setContainer,
      setUseBrowserWindow,
      setScreenshotDetail,
      setSelectedNs,
      setTags,
      setIsPlural,
      setPluralArgName,
    };

    return [contextValue, actions];
  });
