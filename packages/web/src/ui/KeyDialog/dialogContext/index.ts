import { useEffect, useMemo, useState } from 'react';

import { sleep } from '../../tools/sleep';
import { createProvider } from '../../tools/createProvider';
import { putBaseLangFirst, putBaseLangFirstTags } from '../languageHelpers';
import { UiProps } from '@tolgee/core';
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
import {
  TolgeeFormat,
  getTolgeeFormat,
  tolgeeFormatGenerateIcu,
} from '@tginternal/editor';

const MINIMAL_PLATFORM_VERSION = 'v3.42.0';

type FormTranslations = {
  [key: string]: {
    value: TolgeeFormat;
    state: StateType;
  };
};

type DialogProps = {
  keyName: string;
  defaultValue: string;
  open: boolean;
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

    const [translationsFormTouched, setTranslationsFormTouched] =
      useState(false);

    const [selectedNs, setSelectedNs] = useState<string>(props.namespace);
    const [tags, setTags] = useState<string[]>([]);
    const [isPlural, setIsPlural] = useState<boolean>(false);
    const [pluralArgName, setPluralArgName] = useState<string>();

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
        keepPreviousData: true,
        onSuccess(data) {
          const result: FormTranslations = {};
          const firstKey = data._embedded?.keys?.[0];
          const isPlural = Boolean(firstKey?.keyIsPlural);
          setIsPlural(isPlural);
          setPluralArgName(firstKey?.keyPluralArgName);
          Object.entries(firstKey?.translations || {}).forEach(
            ([key, value]) => {
              result[key] = {
                value: getTolgeeFormat(value.text || '', isPlural),
                state: value.state,
              };
            }
          );
          _setTranslationsForm(result);
          setTags(firstKey?.keyTags?.map((t) => t.name) || []);
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

    const keyData = translationsLoadable.data?._embedded?.keys?.[0];

    const keyExists = Boolean(
      translationsLoadable.data?._embedded?.keys?.length
    );

    const permissions = useComputedPermissions(
      scopesLoadable.data,
      keyExists,
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
      setSuccess(false);
      setTranslationsFormTouched(true);
      setTranslation(key, value);
    }

    function onStateChange(key: string, value: StateType) {
      setSuccess(false);
      setTranslationsFormTouched(true);
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
            newTranslations[language] = tolgeeFormatGenerateIcu(value.value);
          }
          if (
            newTranslations[language] &&
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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
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
        Object.entries(translationsForm).map(([language, value]) => [
          language,
          tolgeeFormatGenerateIcu(value.value),
        ])
      );
    }

    // sets the default value for base language if is not stored already
    useEffect(() => {
      if (
        props.defaultValue &&
        availableLanguages &&
        selectedLanguages &&
        translationsForm
      ) {
        const baseLanguageDefinition = availableLanguages.find((l) => l.base);
        if (
          baseLanguageDefinition &&
          selectedLanguages.includes(baseLanguageDefinition.tag!) &&
          !translationsFormTouched
        ) {
          const wasBaseTranslationProvided =
            keyData?.translations?.[baseLanguageDefinition.tag!] !== undefined;

          if (
            !translationsForm[baseLanguageDefinition.tag!] &&
            !wasBaseTranslationProvided
          ) {
            setTranslation(
              baseLanguageDefinition.tag!,
              getTolgeeFormat(props.defaultValue ?? '', isPlural)
            );
          }
        }
      }
    }, [
      availableLanguages,
      translationsForm,
      selectedLanguages,
      props.defaultValue,
    ]);

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
      open: props.open,
      fallbackNamespaces: props.fallbackNamespaces,
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
      tags,
      permissions,
      canTakeScreenshots,
      isPlural,
      pluralArgName,
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
