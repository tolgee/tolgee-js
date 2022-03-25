import { useEffect, useState } from 'react';
import { KeyWithTranslationsModel, LanguageModel } from '@tolgee/core';

import { ComponentDependencies } from './KeyDialog';
import { sleep } from '../tools/sleep';
import { createProvider } from '../tools/createProvider';

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

interface TranslationInterface {
  text?: string;
}

type DialogProps = {
  input: string;
  defaultValue: string;
  open: boolean;
  onClose: () => void;
  dependencies: ComponentDependencies;
};

const responseToTranslationData = (
  data: Record<string, TranslationInterface> | undefined
): FormTranslations => {
  const translations: Record<string, string> = {};
  if (data) {
    Object.entries(data).forEach(
      ([language, translation]) => (translations[language] = translation.text)
    );
  }
  return translations;
};

type State =
  | { type: 'ON_INPUT_CHANGE'; payload: { key: string; value: string } }
  | {
      type: 'ON_SELECTED_LANGUAGES_CHANGE';
      payload: { languages: Set<string> };
    }
  | {
      type: 'LOAD_TRANSLATIONS';
      payload: { reinitialize?: boolean; languages: Set<string> };
    }
  | { type: 'HANDLE_UPLOAD_IMAGES'; payload: { files: File[] } }
  | { type: 'HANDLE_TAKE_SCREENSHOT' }
  | { type: 'HANDLE_REMOVE_SCREENSHOT'; payload: { id: number } }
  | { type: 'ON_SAVE' }
  | { type: 'ON_CLOSE' }
  | { type: 'SET_USE_BROWSER_WINDOW'; payload: boolean }
  | { type: 'SET_CONTAINER'; payload: Element }
  | { type: 'OPEN_SCREENSHOT_DETAIL'; payload: ScreenshotInterface }
  | { type: 'CLOSE_SCREENSHOT_DETAIL' }
  | { type: 'ON_ESCAPE' };

export const [DialogProvider, useDialogDispatch, useDialogContext] =
  createProvider((props: DialogProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [takingScreenshot, setTakingScreenshot] = useState<boolean>(false);
    const [translations, setTranslations] =
      useState<KeyWithTranslationsModel>(null);
    const [translationsForm, setTranslationsForm] =
      useState<FormTranslations>(null);
    const [translationsFormTouched, setTranslationsFormTouched] =
      useState(false);

    const coreService = props.dependencies.coreService;
    const properties = props.dependencies.properties;
    const linkToPlatform =
      properties.projectId !== undefined
        ? `${properties.config.apiUrl}/projects/${properties.projectId}/translations/single?key=${props.input}`
        : undefined;

    const translationService = props.dependencies.translationService;
    const screenshotService = props.dependencies.screenshotService;
    const [container, setContainer] = useState(
      undefined as Element | undefined
    );
    const [useBrowserWindow, setUseBrowserWindow] = useState(false);
    const [screenshots, setScreenshots] = useState<ScreenshotInterface[]>([]);
    const [screenshotsUploading, setScreenshotsUploading] = useState(false);
    const [screenshotDetail, setScreenshotDetail] =
      useState<ScreenshotInterface | null>(null);

    const dispatch = async (action: State) => {
      switch (action.type) {
        case 'ON_INPUT_CHANGE':
          setSuccess(false);
          setTranslationsFormTouched(true);
          setTranslationsForm({
            ...translationsForm,
            [action.payload.key]: action.payload.value,
          });
          break;

        case 'LOAD_TRANSLATIONS': {
          const { reinitialize = true, languages } = action.payload;
          translationService
            .getTranslationsOfKey(props.input, languages)
            .then(([result, languages]) => {
              setTranslations(
                result || {
                  keyId: undefined,
                  translations: {},
                  screenshots: [],
                  keyName: props.input,
                  keyTags: [],
                  screenshotCount: 0,
                }
              );

              if (!selectedLanguages?.size) {
                setSelectedLanguages(new Set(languages));
              }

              const translationsData = responseToTranslationData(
                result?.translations
              );
              if (!translationsForm || reinitialize) {
                // reset form
                setTranslationsForm(translationsData);

                setScreenshots(
                  result?.screenshots?.map((sc) => ({
                    ...sc,
                    justUploaded: false,
                  })) || []
                );
              } else {
                // update form
                const result: FormTranslations = {};
                languages.forEach((lng) => {
                  result[lng] = translationsForm[lng] || translationsData[lng];
                });
                setTranslationsForm(result);
              }
              setLoading(false);
            });
          break;
        }

        case 'HANDLE_UPLOAD_IMAGES':
          setScreenshotsUploading(true);
          await Promise.all(action.payload.files.map(uploadImage));
          setScreenshotsUploading(false);
          break;

        case 'HANDLE_TAKE_SCREENSHOT': {
          setTakingScreenshot(true);
          const data = await props.dependencies.pluginManager.takeScreenshot({
            key: props.input,
            translations: translationsForm,
          });

          setTakingScreenshot(false);
          setScreenshotsUploading(true);

          const blob = await fetch(data).then((r) => r.blob());

          await uploadImage(blob);
          setScreenshotsUploading(false);
          break;
        }

        case 'HANDLE_REMOVE_SCREENSHOT': {
          const { id } = action.payload;
          const screenshot = screenshots.find((sc) => sc.id === id);
          if (screenshot.justUploaded) {
            screenshotService.deleteImages([screenshot.id]);
          }
          setScreenshots(screenshots.filter((sc) => sc.id !== id));
          break;
        }

        case 'ON_SAVE': {
          setSaving(true);
          try {
            if (translations.keyId === undefined) {
              await translationService.createKey({
                name: props.input,
                translations: translationsForm,
                screenshotUploadedImageIds: screenshots.map((sc) => sc.id),
              });
            } else {
              await translationService.updateKeyComplex(translations.keyId, {
                name: props.input,
                translations: translationsForm,
                screenshotIdsToDelete: getRemovedScreenshots(),
                screenshotUploadedImageIds: getJustUploadedScreenshots(),
              });
            }
            await sleep(200);
            setSuccess(true);
            setError(null);
            if (useBrowserWindow) {
              setSaving(false);
              await sleep(2000);
              setSuccess(false);
            } else {
              props.onClose();
            }
          } catch (e) {
            setError('Unexpected error occurred :(');
            // eslint-disable-next-line no-console
            console.error(e);
          } finally {
            setSaving(false);
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
              screenshotService.deleteImages(uploadedScreenshots);
            }
            setScreenshots([]);
          }
          break;
        }

        case 'ON_SELECTED_LANGUAGES_CHANGE': {
          const { languages } = action.payload;
          if (languages.size) {
            setSelectedLanguages(languages);
            properties.preferredLanguages = languages;
            dispatch({
              type: 'LOAD_TRANSLATIONS',
              payload: { languages, reinitialize: false },
            });
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
      }
    };

    useEffect(() => {
      const onKeyDown = (e) => {
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

    useEffect(() => {
      if (props.open) {
        setLoading(true);
        setSuccess(false);
        setError(null);
        setTranslationsFormTouched(false);
        dispatch({
          type: 'LOAD_TRANSLATIONS',
          payload: { languages: properties.preferredLanguages },
        });
        if (availableLanguages === undefined) {
          coreService.getLanguagesFull().then((l) => {
            setAvailableLanguages(l);
          });
        }
      }
    }, [props.open, useBrowserWindow, props.input]);

    const getJustUploadedScreenshots = () => {
      return screenshots.filter((sc) => sc.justUploaded).map((sc) => sc.id);
    };

    const getRemovedScreenshots = () => {
      return translations.screenshots
        ?.map((sc) => sc.id)
        .filter((scId) => !screenshots.find((sc) => sc.id === scId));
    };

    const uploadImage = async (file: Blob) => {
      await screenshotService
        .uploadImage(file)
        .then((data) =>
          setScreenshots((screenshots) => [
            ...screenshots,
            { ...data, justUploaded: true },
          ])
        )
        .catch((e) => {
          setError(e.code || e.message);
        });
    };

    const formDisabled =
      loading ||
      (translations.keyId
        ? !coreService.isAuthorizedTo('translations.edit')
        : !coreService.isAuthorizedTo('keys.edit'));

    const [availableLanguages, setAvailableLanguages] =
      useState<LanguageModel[]>(undefined);

    const [selectedLanguages, setSelectedLanguages] = useState(
      properties.preferredLanguages || new Set([properties.currentLanguage])
    );

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
          selectedLanguages.has(baseLanguageDefinition.tag) &&
          !translationsFormTouched
        ) {
          const wasBaseTranslationProvided =
            translations.translations[baseLanguageDefinition.tag] !== undefined;

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

    const contextValue = {
      input: props.input,
      dependencies: props.dependencies,
      open: props.open,
      loading,
      saving,
      success,
      error,
      availableLanguages,
      selectedLanguages,
      formDisabled,
      translations,
      translationsForm,
      container,
      useBrowserWindow,
      pluginAvailable: props.dependencies.pluginManager.handshakeSucceed,
      takingScreenshot,
      screenshotsUploading,
      screenshots,
      screenshotDetail,
      linkToPlatform,
    };

    return [contextValue, dispatch];
  });
