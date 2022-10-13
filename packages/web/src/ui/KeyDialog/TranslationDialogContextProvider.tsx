import { useEffect, useMemo, useState } from 'react';

import { sleep } from '../tools/sleep';
import { createProvider } from '../tools/createProvider';
import { isLanguagePermitted } from '../tools/isLanguagePermitted';
import { putBaseLangFirst, putBaseLangFirstTags } from './languageHelpers';
import { FallbackNsTranslation, getFallbackArray, UiProps } from '@tolgee/core';
import { useApiMutation, useApiQuery } from '../../ui/client/useQueryApi';
import { isAuthorizedTo } from './ScreenshotGallery/utils';
import { getInitialLanguages, setPreferredLanguages } from './tools';
import { detectExtension, takeScreenshot } from '../../tools/extension';
import { getApiKeyType } from '../../tools/decodeApiKey';

export interface ScreenshotInterface {
  id: number;
  filename: string;
  fileUrl: string;
  createdAt?: string;
  // is it screenshot or only uploaded image
  justUploaded: boolean;
}

type FormTranslations = {
  [key: string]: string;
};

type DialogProps = {
  keyName: string;
  defaultValue: string;
  open: boolean;
  onClose: () => void;
  uiProps: UiProps;
  ns: FallbackNsTranslation;
};

type Actions =
  | { type: 'ON_INPUT_CHANGE'; payload: { key: string; value: string } }
  | {
      type: 'ON_SELECTED_LANGUAGES_CHANGE';
      payload: { languages: string[] };
    }
  | { type: 'HANDLE_UPLOAD_IMAGES'; payload: { files: File[] } }
  | { type: 'HANDLE_TAKE_SCREENSHOT' }
  | { type: 'HANDLE_REMOVE_SCREENSHOT'; payload: { id: number } }
  | { type: 'ON_SAVE' }
  | { type: 'ON_CLOSE' }
  | { type: 'SET_USE_BROWSER_WINDOW'; payload: boolean }
  | { type: 'SET_CONTAINER'; payload: Element | undefined }
  | { type: 'OPEN_SCREENSHOT_DETAIL'; payload: ScreenshotInterface }
  | { type: 'CLOSE_SCREENSHOT_DETAIL' }
  | { type: 'ON_ESCAPE' }
  | { type: 'SELECTED_NS_CHANGE'; payload: { ns: string } };

export const [DialogProvider, useDialogDispatch, useDialogContext] =
  createProvider((props: DialogProps) => {
    const [namespaces, setNamespaces] = useState<undefined | string[]>();
    const [success, setSuccess] = useState<boolean>(false);
    const [takingScreenshot, setTakingScreenshot] = useState(false);
    const [translationsForm, setTranslationsForm] = useState<FormTranslations>(
      {}
    );
    const [pluginAvailable, setPluginAvailable] = useState<boolean | undefined>(
      undefined
    );
    const [translationsFormTouched, setTranslationsFormTouched] =
      useState(false);
    const [selectedNs, setSelectedNs] = useState<string>(
      getFallbackArray(props.ns)[0]
    );
    const isPat = getApiKeyType(props.uiProps.apiKey) === 'tgpat';

    const scopesLoadable = useApiQuery({
      url: '/v2/api-keys/current',
      method: 'get',
      options: {
        enabled: !isPat,
      },
    });

    useEffect(() => {
      detectExtension().then((available) => setPluginAvailable(available));
    }, []);

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

    const availableLanguages = useMemo(() => {
      return putBaseLangFirst(languagesLoadable.data?._embedded?.languages);
    }, [languagesLoadable.data]);

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const changeInCache = (values: [language: string, value: string][]) => {
      const changers = values.map(([language, value]) =>
        props.uiProps.changeTranslation(
          {
            language,
            namespace: selectedNs,
          },
          props.keyName,
          value
        )
      );
      return { revert: () => changers.forEach((ch) => ch.revert()) };
    };

    const translationsLoadable = useApiQuery({
      url: '/v2/projects/translations',
      method: 'get',
      query: {
        filterKeyName: [props.keyName],
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

    const uploadImage = useApiMutation({
      url: '/v2/image-upload',
      method: 'post',
      options: {
        onSuccess(data) {
          setScreenshots((screenshots) => [
            ...screenshots,
            { ...data, justUploaded: true },
          ]);
        },
      },
    });

    const deleteImage = useApiMutation({
      url: '/v2/image-upload/{ids}',
      method: 'delete',
    });

    const createKey = useApiMutation({
      url: '/v2/projects/keys/create',
      method: 'post',
    });

    const updateKey = useApiMutation({
      url: '/v2/projects/keys/{id}/complex-update',
      method: 'put',
    });

    const translations = translationsLoadable.data?._embedded?.keys?.[0];

    const linkToPlatform =
      scopesLoadable.data?.projectId !== undefined
        ? `${props.uiProps.apiUrl}/projects/${scopesLoadable.data?.projectId}/translations/single?key=${props.keyName}`
        : undefined;

    const [container, setContainer] = useState(
      undefined as Element | undefined
    );
    const [useBrowserWindow, setUseBrowserWindow] = useState(false);
    const [screenshots, setScreenshots] = useState<ScreenshotInterface[]>([]);
    const [screenshotDetail, setScreenshotDetail] =
      useState<ScreenshotInterface | null>(null);

    const permittedLanguageIds = scopesLoadable.data?.permittedLanguageIds;

    const uploadScreenshot = (blob: Blob) =>
      uploadImage.mutate({
        content: { 'multipart/form-data': { image: blob as any } },
      });

    const dispatch = async (action: Actions) => {
      switch (action.type) {
        case 'ON_INPUT_CHANGE':
          setSuccess(false);
          setTranslationsFormTouched(true);
          setTranslationsForm({
            ...translationsForm,
            [action.payload.key]: action.payload.value,
          });
          setSelectedNs(getFallbackArray(props.ns)[0]);
          break;

        case 'HANDLE_UPLOAD_IMAGES':
          await Promise.all(
            action.payload.files.map((content) => uploadScreenshot(content))
          );
          break;

        case 'HANDLE_TAKE_SCREENSHOT': {
          setTakingScreenshot(true);
          const { unhighlight } = props.uiProps.highlight(
            props.keyName,
            selectedNs
          );
          const { revert } = changeInCache(Object.entries(translationsForm));
          await sleep(100);
          let screenshot: string;
          try {
            screenshot = await takeScreenshot();
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            break;
          } finally {
            revert();
            unhighlight();
            setTakingScreenshot(false);
          }

          const blob = await fetch(screenshot).then((r) => r.blob());

          uploadScreenshot(blob);
          break;
        }

        case 'HANDLE_REMOVE_SCREENSHOT': {
          const { id } = action.payload;
          const screenshot = screenshots.find((sc) => sc.id === id);
          if (screenshot?.justUploaded) {
            deleteImage.mutate({ path: { ids: [screenshot.id] } });
          }
          setScreenshots(screenshots.filter((sc) => sc.id !== id));
          break;
        }

        case 'ON_SAVE': {
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
                    translations: newTranslations,
                    screenshotIdsToDelete: getRemovedScreenshots(),
                    screenshotUploadedImageIds: getJustUploadedScreenshots(),
                  },
                },
                path: { id: translations.keyId },
              });
            }
            changeInCache(Object.entries(newTranslations));
            setNamespaces([selectedNs]);
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
          break;
        }

        case 'ON_CLOSE': {
          if (screenshotDetail) {
            setScreenshotDetail(null);
          } else {
            props.onClose();
            setUseBrowserWindow(false);
            const uploadedScreenshots = getJustUploadedScreenshots();
            if (uploadedScreenshots.length) {
              deleteImage.mutate({ path: { ids: uploadedScreenshots } });
            }
            setScreenshots([]);
          }
          break;
        }

        case 'ON_SELECTED_LANGUAGES_CHANGE': {
          const { languages } = action.payload;
          if (languages.length) {
            setSelectedLanguages(languages);
            setPreferredLanguages(languages);
          }
          break;
        }

        case 'SET_CONTAINER':
          setContainer(action.payload);
          break;

        case 'SET_USE_BROWSER_WINDOW':
          setUseBrowserWindow(action.payload);
          break;

        case 'OPEN_SCREENSHOT_DETAIL':
          setScreenshotDetail(action.payload);
          break;

        case 'CLOSE_SCREENSHOT_DETAIL':
          setScreenshotDetail(null);
          break;
        case 'SELECTED_NS_CHANGE':
          setSelectedNs(action.payload.ns);
          break;
      }
    };

    useEffect(() => {
      const onKeyDown = (e: any) => {
        if (e.key === 'Escape') {
          dispatch({ type: 'ON_ESCAPE' });
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
      scopesLoadable.error;

    const screenshotsUploading = uploadImage.isLoading;

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
      ns: namespaces || props.ns,
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
      pluginAvailable,
      takingScreenshot,
      screenshotsUploading,
      screenshots,
      screenshotDetail,
      linkToPlatform,
      keyExists,
      scopes,
      permittedLanguageIds,
    };

    return [contextValue, dispatch];
  });
