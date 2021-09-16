import React, { FunctionComponent, useEffect, useState } from 'react';
import { TranslationData } from '@tolgee/core/lib/DTOs/TranslationData';
import { EventEmitterImpl } from '@tolgee/core/lib/services/EventEmitter';

import { ComponentDependencies } from '../TolgeeViewer';
import { sleep } from '../tools/sleep';

type DialogProps = {
  input: string;
  open: boolean;
  onClose: () => void;
  dependencies: ComponentDependencies;
};

export type DialogContextType = {
  loading: boolean;
  saving: boolean;
  error: string;
  success: boolean;
  availableLanguages: Set<string>;
  selectedLanguages: Set<string>;
  onSelectedLanguagesChange: (val: Set<string>) => void;
  editDisabled: boolean;
  onTranslationInputChange: (
    abbr
  ) => (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  translations: TranslationData;
  onSave: () => void;
  container: Element | undefined;
  setContainer: (el: Element) => void;
  useBrowserWindow: boolean;
  setUseBrowserWindow: (value: boolean) => void;
  pluginAvailable: boolean;
  takingScreenshot: boolean;
  handleTakeScreenshot: (key: string) => Promise<any>;
  lastScreenshot?: string;
  removeLastScreenshot: () => void;
  onScreenshotUpload: () => Promise<void>;
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
    const [translations, setTranslations] = useState<TranslationData>(null);
    const coreService = props.dependencies.coreService;
    const properties = props.dependencies.properties;
    const translationService = props.dependencies.translationService;
    const [container, setContainer] = useState(
      undefined as Element | undefined
    );
    const [useBrowserWindow, setUseBrowserWindow] = useState(false);
    const [lastScreenshot, setLastScreenshot] = useState<string>();

    const onTranslationInputChange =
      (abbr) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSuccess(false);
        translations.translations[abbr] = event.target.value;
        setTranslations({ ...translations });
      };

    const loadTranslations = (languages?: Set<string>) => {
      translationService
        .getTranslationsOfKey(props.input, languages)
        .then((result) => {
          setTranslations(result);
          setLoading(false);
        });
    };

    const onClose = () => {
      props.onClose();
      setUseBrowserWindow(false);
      setLastScreenshot(undefined);
    };

    const removeLastScreenshot = () => setLastScreenshot(undefined);

    useEffect(() => {
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          if (lastScreenshot) {
            removeLastScreenshot();
          } else {
            onClose();
          }
        }
      };
      if (!useBrowserWindow) {
        window.addEventListener('keydown', onKeyDown);
        return () => {
          window.removeEventListener('keydown', onKeyDown);
        };
      }
    }, [useBrowserWindow, lastScreenshot]);

    useEffect(() => {
      if (props.open) {
        setLoading(true);
        setSuccess(false);
        setError(null);
        loadTranslations(properties.preferredLanguages);
        if (availableLanguages === undefined) {
          coreService.getLanguages().then((l) => {
            setAvailableLanguages(l);
          });
        }
      }
    }, [props.open, useBrowserWindow, props.input]);

    const onSave = async () => {
      setSaving(true);
      try {
        setSaving(true);
        await translationService.setTranslations(translations);
        await (
          props.dependencies.eventService
            .TRANSLATION_CHANGED as EventEmitterImpl<TranslationData>
        ).emit(translations);
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

    const onScreenshotUpload = async () => {
      let id = translations?.id;
      if (!id) {
        const newEntry = await translationService.setTranslations(
          new TranslationData(props.input, {})
        );
        id = newEntry.keyId;
      }
      await translationService.uploadScreenshot(id, lastScreenshot);
      loadTranslations(properties.preferredLanguages);
    };

    const handleTakeScreenshot = async () => {
      setTakingScreenshot(true);
      props.dependencies.elementRegistrar
        .findAllByKey(props.input)
        .forEach((el) => el._tolgee.highlight());
      await sleep(100);
      const data = await props.dependencies.pluginManager.takeScreenshot();
      props.dependencies.elementRegistrar
        .findAllByKey(props.input)
        .forEach((el) => el._tolgee.unhighlight());
      setTakingScreenshot(false);
      setLastScreenshot(data as string);
      return data;
    };

    const editDisabled =
      loading || !coreService.isAuthorizedTo('translations.edit');

    const [availableLanguages, setAvailableLanguages] = useState(undefined);

    const [selectedLanguages, setSelectedLanguages] = useState(
      properties.preferredLanguages || new Set([properties.currentLanguage])
    );

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
      editDisabled,
      onTranslationInputChange,
      translations,
      onSave,
      container,
      setContainer,
      useBrowserWindow,
      setUseBrowserWindow,
      pluginAvailable: props.dependencies.pluginManager.handshakeSucceed,
      takingScreenshot,
      handleTakeScreenshot,
      lastScreenshot,
      removeLastScreenshot,
      onScreenshotUpload,
    };

    return (
      <TranslationDialogContext.Provider value={contextValue}>
        {props.children}
      </TranslationDialogContext.Provider>
    );
  };
