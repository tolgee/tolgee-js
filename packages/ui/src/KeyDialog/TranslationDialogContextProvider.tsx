import React, { FunctionComponent, useEffect, useState } from 'react';
import { KeyWithTranslationsModel, LanguageModel } from '@tolgee/core';

import { ComponentDependencies } from './KeyDialog';
import { sleep } from '../tools/sleep';

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

export type DialogContextType = {
  loading: boolean;
  saving: boolean;
  error: string;
  success: boolean;
  availableLanguages: LanguageModel[];
  selectedLanguages: Set<string>;
  onSelectedLanguagesChange: (val: Set<string>) => void;
  formDisabled: boolean;
  onTranslationInputChange: (
    abbr
  ) => (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  translations: KeyWithTranslationsModel;
  translationsForm: FormTranslations;
  onSave: () => void;
  container: Element | undefined;
  setContainer: (el: Element) => void;
  useBrowserWindow: boolean;
  setUseBrowserWindow: (value: boolean) => void;
  pluginAvailable: boolean;
  takingScreenshot: boolean;
  handleTakeScreenshot: () => Promise<void>;
  handleUploadImages: (files: File[]) => Promise<any>;
  screenshotsUploading: boolean;
  screenshots?: ScreenshotInterface[];
  removeScreenshot: (id: number) => void;
} & DialogProps;

export const TranslationDialogContext =
  React.createContext<DialogContextType>(undefined);

export const TranslationDialogContextProvider: FunctionComponent<DialogProps> =
  (props) => {
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
    const translationService = props.dependencies.translationService;
    const screenshotService = props.dependencies.screenshotService;
    const [container, setContainer] = useState(
      undefined as Element | undefined
    );
    const [useBrowserWindow, setUseBrowserWindow] = useState(false);
    const [screenshots, setScreenshots] = useState<ScreenshotInterface[]>([]);
    const [screenshotsUploading, setScreenshotsUploading] = useState(false);

    const onTranslationInputChange =
      (abbr) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSuccess(false);
        translationsForm[abbr] = event.target.value;
        setTranslationsFormTouched(true);
        setTranslationsForm({ ...translationsForm });
      };

    const loadTranslations = (languages?: Set<string>, reinitialize = true) => {
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

          if (!translationsForm || reinitialize) {
            const translationsData = responseToTranslationData(
              result?.translations
            );
            setTranslationsForm(translationsData);

            setScreenshots(
              result?.screenshots?.map((sc) => ({
                ...sc,
                justUploaded: false,
              })) || []
            );
          }
          setLoading(false);
        });
    };

    const onClose = () => {
      props.onClose();
      setUseBrowserWindow(false);
      const uploadedScreenshots = getJustUploadedScreenshots();
      if (uploadedScreenshots.length) {
        screenshotService.deleteImages(uploadedScreenshots);
      }
      setScreenshots([]);
    };

    useEffect(() => {
      const onKeyDown = (e) => {
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

    useEffect(() => {
      if (props.open) {
        setLoading(true);
        setSuccess(false);
        setError(null);
        setTranslationsFormTouched(false);
        loadTranslations(properties.preferredLanguages);
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

    const onSave = async () => {
      setSaving(true);
      try {
        setSaving(true);
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
        setSuccess(true);
        await sleep(200);
        setError(null);
        props.onClose();
      } catch (e) {
        setError('Unexpected error occurred :(');
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setSaving(false);
      }
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

    const handleUploadImages = async (files: File[]) => {
      setScreenshotsUploading(true);
      await Promise.all(files.map(uploadImage));
      setScreenshotsUploading(false);
    };

    const handleTakeScreenshot = async () => {
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
    };

    const removeScreenshot = async (id: number) => {
      const screenshot = screenshots.find((sc) => sc.id === id);
      if (screenshot.justUploaded) {
        screenshotService.deleteImages([screenshot.id]);
      }
      setScreenshots(screenshots.filter((sc) => sc.id !== id));
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

    const onSelectedLanguagesChange = (value: Set<string>) => {
      if (value.size) {
        setSelectedLanguages(value);
        properties.preferredLanguages = value;
        loadTranslations(value);
      }
    };

    const contextValue: DialogContextType = {
      ...props,
      onClose,
      loading,
      saving,
      success,
      error,
      availableLanguages,
      selectedLanguages,
      onSelectedLanguagesChange,
      formDisabled,
      onTranslationInputChange,
      translations,
      translationsForm,
      onSave,
      container,
      setContainer,
      useBrowserWindow,
      setUseBrowserWindow,
      pluginAvailable: props.dependencies.pluginManager.handshakeSucceed,
      takingScreenshot,
      handleTakeScreenshot,
      handleUploadImages,
      screenshotsUploading,
      screenshots,
      removeScreenshot,
    };

    return (
      <TranslationDialogContext.Provider value={contextValue}>
        {props.children}
      </TranslationDialogContext.Provider>
    );
  };
