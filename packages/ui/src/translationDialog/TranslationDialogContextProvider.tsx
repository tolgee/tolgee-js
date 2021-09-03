import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { ComponentDependencies } from '../TolgeeViewer';
import { TranslationData } from '@tolgee/core/lib/DTOs/TranslationData';
import { EventEmitterImpl } from '@tolgee/core/lib/services/EventEmitter';

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
} & DialogProps;

export const TranslationDialogContext =
  React.createContext<DialogContextType>(undefined);

export const TranslationDialogContextProvider: FunctionComponent<DialogProps> =
  (props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [translations, setTranslations] = useState<TranslationData>(null);
    const coreService = props.dependencies.coreService;
    const properties = props.dependencies.properties;
    const translationService = props.dependencies.translationService;
    const [container, setContainer] = useState(
      undefined as Element | undefined
    );
    const [useBrowserWindow, setUseBrowserWindow] = useState(false);

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
    };

    useEffect(() => {
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

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
        if (!useBrowserWindow) {
          window.addEventListener('keydown', onKeyDown);
        }
      }

      return () => {
        window.removeEventListener('keydown', onKeyDown);
      };
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
        await new Promise((resolve) => setTimeout(resolve, 200));
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
    };

    return (
      <TranslationDialogContext.Provider value={contextValue}>
        {props.children}
      </TranslationDialogContext.Provider>
    );
  };
