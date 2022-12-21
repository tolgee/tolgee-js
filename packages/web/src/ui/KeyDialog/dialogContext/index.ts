import { useEffect, useMemo, useState } from 'react';

import { sleep } from '../../tools/sleep';
import { createProvider } from '../../tools/createProvider';
import { isLanguagePermitted } from '../../tools/isLanguagePermitted';
import { putBaseLangFirst, putBaseLangFirstTags } from '../languageHelpers';
import { UiProps } from '@tolgee/core';
import { useApiMutation, useApiQuery } from '../../client/useQueryApi';
import { isAuthorizedTo } from '../ScreenshotGallery/utils';
import {
  changeInTolgeeCache,
  getInitialLanguages,
  setPreferredLanguages,
} from './tools';
import { getApiKeyType } from '../../../tools/decodeApiKey';
import { useGallery } from './useGallery';

type FormTranslations = {
  [key: string]: string;
};

type DialogProps = {
  keyName: string;
  defaultValue: string;
  open: boolean;
  onClose: () => void;
  uiProps: UiProps;
  ns: string[];
};

export const [DialogProvider, useDialogActions, useDialogContext] =
  createProvider((props: DialogProps) => {
    const [success, setSuccess] = useState<boolean>(false);
    const [translationsForm, setTranslationsForm] = useState<FormTranslations>(
      {}
    );

    const [translationsFormTouched, setTranslationsFormTouched] =
      useState(false);

    const [selectedNs, setSelectedNs] = useState<string>(props.ns[0]);
    const isPat = getApiKeyType(props.uiProps.apiKey) === 'tgpat';

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
      url: '/v2/api-keys/current',
      method: 'get',
      options: {
        enabled: !isPat,
      },
    });

    const languagesLoadable = useApiQuery({
      url: '/v2/projects/languages',
      method: 'get',
      options: {
        onSuccess(data) {
          setSelectedLanguages(
            getInitialLanguages(
              data._embedded?.languages?.map((l) => l.tag) || []
            )
          );
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

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const translationsLoadable = useApiQuery({
      url: '/v2/projects/translations',
      method: 'get',
      query: {
        filterKeyName: [props.keyName],
        filterNamespace: props.ns,
        languages: selectedLanguages,
      },
      options: {
        keepPreviousData: true,
        enabled: Boolean(selectedLanguages.length),
        onSuccess(data) {
          const result: FormTranslations = {};
          Object.entries(data._embedded?.keys?.[0].translations || {}).forEach(
            ([key, value]) => {
              result[key] = value.text || '';
            }
          );
          setTranslationsForm(result);
          setScreenshots(
            data._embedded?.keys?.[0].screenshots?.map((sc) => ({
              ...sc,
              justUploaded: false,
            })) || []
          );
        },
      },
    });

    const namespaces = useMemo(() => {
      const keys = translationsLoadable.data?._embedded?.keys;
      if (keys?.length) {
        return [keys[0].keyNamespace || ''];
      } else {
        return props.ns;
      }
    }, [translationsLoadable.data]);

    const updateKey = useApiMutation({
      url: '/v2/projects/keys/{id}/complex-update',
      method: 'put',
    });

    const translations = translationsLoadable.data?._embedded?.keys?.[0];

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

    const permittedLanguageIds = scopesLoadable.data?.permittedLanguageIds;

    function onInputChange(key: string, value: string) {
      setSuccess(false);
      setTranslationsFormTouched(true);
      setTranslationsForm({
        ...translationsForm,
        [key]: value,
      });
    }

    async function onSave() {
      try {
        const newTranslations = {} as typeof translationsForm;
        Object.entries(translationsForm).forEach(([language, value]) => {
          if (
            isLanguagePermitted(
              language,
              permittedLanguageIds,
              availableLanguages
            )
          ) {
            newTranslations[language] = value;
          }
        });

        if (translations === undefined) {
          await createKey.mutateAsync({
            content: {
              'application/json': {
                name: props.keyName,
                namespace: selectedNs || undefined,
                translations: newTranslations,
                screenshotUploadedImageIds: screenshots.map((sc) => sc.id),
              },
            },
          });
        } else {
          await updateKey.mutateAsync({
            content: {
              'application/json': {
                name: props.keyName,
                namespace: selectedNs || undefined,
                translations: newTranslations,
                screenshotIdsToDelete: getRemovedScreenshots(),
                screenshotUploadedImageIds: getJustUploadedScreenshots(),
              },
            },
            path: { id: translations.keyId },
          });
        }
        changeInTolgeeCache(
          props.keyName,
          selectedNs,
          Object.entries(newTranslations),
          props.uiProps.changeTranslation
        );
        translationsLoadable.refetch();
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
          deleteImages(uploadedScreenshots);
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
      return screenshots.filter((sc) => sc.justUploaded).map((sc) => sc.id);
    };

    const getRemovedScreenshots = () => {
      return (
        translations?.screenshots
          ?.map((sc) => sc.id)
          .filter((scId) => !screenshots.find((sc) => sc.id === scId)) || []
      );
    };

    function handleTakeScreenshot() {
      galleryProps.handleTakeScreenshot(
        props.keyName,
        selectedNs,
        translationsForm
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
          selectedLanguages.includes(baseLanguageDefinition.tag) &&
          !translationsFormTouched
        ) {
          const wasBaseTranslationProvided =
            translations?.translations[baseLanguageDefinition.tag] !==
            undefined;

          if (
            !translationsForm[baseLanguageDefinition.tag] &&
            !wasBaseTranslationProvided
          ) {
            setTranslationsForm({
              ...translationsForm,
              [baseLanguageDefinition.tag]: props.defaultValue,
            });
          }
        }
      }
    }, [
      availableLanguages,
      translationsForm,
      selectedLanguages,
      props.defaultValue,
    ]);

    const baseLang = availableLanguages?.find(({ base }) => base);
    const loading =
      languagesLoadable.isFetching ||
      (translationsLoadable.isLoading && !translationsLoadable.data) ||
      scopesLoadable.isFetching;
    const saving = updateKey.isLoading || createKey.isLoading;
    const error =
      languagesLoadable.error ||
      translationsLoadable.error ||
      scopesLoadable.error ||
      createKey.error ||
      updateKey.error ||
      galleryError;

    const scopes = scopesLoadable.data?.scopes;

    const formDisabled =
      !isPat &&
      (loading ||
        (translationsLoadable.data?._embedded?.keys?.length
          ? !isAuthorizedTo('translations.edit', scopes)
          : !isAuthorizedTo('keys.edit', scopes)));

    const keyExists = Boolean(
      translationsLoadable.data?._embedded?.keys?.length
    );

    const contextValue = {
      input: props.keyName,
      open: props.open,
      ns: namespaces,
      selectedNs,
      loading,
      saving,
      success,
      error,
      availableLanguages,
      selectedLanguages: putBaseLangFirstTags(selectedLanguages, baseLang?.tag),
      formDisabled,
      translations,
      translationsForm,
      container,
      useBrowserWindow,
      canTakeScreenshots,
      takingScreenshot,
      screenshotsUploading,
      screenshots,
      screenshotDetail,
      linkToPlatform,
      keyExists,
      scopes,
      permittedLanguageIds,
    } as const;

    const actions = {
      onInputChange,
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
    };

    return [contextValue, actions];
  });
