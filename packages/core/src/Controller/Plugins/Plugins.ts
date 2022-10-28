import { isPromise, valueOrPromise } from '../../helpers';
import {
  BackendDevInterface,
  BackendGetRecord,
  BackendInterface,
  FormatterInterface,
  ObserverInterface,
  TranslatePropsInternal,
  TranslationOnClick,
  UiInterface,
  UiLibInterface,
  UiType,
  FinalFormatterInterface,
  HighlightInterface,
  UiConstructor,
  UiKeyOption,
  LanguageDetectorInterface,
  LanguageStorageInterface,
  TolgeeOptions,
  ChangeTranslationInterface,
  WrapperWrapProps,
  Unwrapped,
  KeyAndNamespacesInternal,
  TolgeePlugin,
  TolgeeInstance,
} from '../../types';
import { ObserverOptions } from '../State/initObserverOptions';

export const PluginService = (
  getLanguage: () => string | undefined,
  getInitialOptions: () => TolgeeOptions,
  getObserverOptions: () => ObserverOptions,
  getAvailableLanguages: () => string[] | undefined,
  getTranslationNs: (props: KeyAndNamespacesInternal) => string[] | string,
  getTranslation: (props: KeyAndNamespacesInternal) => string | undefined,
  changeTranslation: ChangeTranslationInterface
) => {
  const plugins = {
    ui: undefined as UiConstructor | undefined,
    observer: undefined as ObserverInterface | undefined,
  };

  const instances = {
    formatters: [] as FormatterInterface[],
    finalFormatter: undefined as FinalFormatterInterface | undefined,
    observer: undefined as ReturnType<ObserverInterface> | undefined,
    devBackend: undefined as BackendDevInterface | undefined,
    backends: [] as BackendInterface[],
    ui: undefined as UiInterface | undefined,
    languageDetector: undefined as LanguageDetectorInterface | undefined,
    languageStorage: undefined as LanguageStorageInterface | undefined,
  };

  const onClick: TranslationOnClick = async (event, { keysAndDefaults }) => {
    const withNs: UiKeyOption[] = keysAndDefaults.map(
      ({ key, ns, defaultValue }) => {
        return {
          key,
          defaultValue,
          ns: getTranslationNs({ key, ns }),
          translation: getTranslation({
            key,
            ns,
          }),
        };
      }
    );
    instances.ui?.handleElementClick(event, withNs);
  };

  const stop = () => {
    instances.ui = undefined;
    instances.observer?.stop();
  };

  const highlight: HighlightInterface = (key, ns) => {
    return instances.observer?.highlight?.(key, ns) || { unhighlight() {} };
  };

  const translate = (props: TranslatePropsInternal) => {
    const translation = getTranslation({
      key: props.key,
      ns: props.ns,
    });
    return formatTranslation({ ...props, translation, formatEnabled: true });
  };

  const setObserver = (observer: ObserverInterface | undefined) => {
    plugins.observer = observer;
  };

  const hasObserver = () => {
    return Boolean(plugins.observer);
  };

  const addFormatter = (formatter: FormatterInterface | undefined) => {
    if (formatter) {
      instances.formatters.push(formatter);
    }
  };

  const setFinalFormatter = (
    formatter: FinalFormatterInterface | undefined
  ) => {
    instances.finalFormatter = formatter;
  };

  const setUi = (ui: UiType | undefined) => {
    plugins.ui = (ui as UiLibInterface)?.UI || ui;
  };

  const hasUi = () => {
    return Boolean(plugins.ui);
  };

  const setLanguageStorage = (
    storage: LanguageStorageInterface | undefined
  ) => {
    instances.languageStorage = storage;
  };

  const setStoredLanguage = (language: string) => {
    instances.languageStorage?.setLanguage(language);
  };

  const setLanguageDetector = (
    detector: LanguageDetectorInterface | undefined
  ) => {
    instances.languageDetector = detector;
  };

  const getLanguageDetector = () => {
    return instances.languageDetector;
  };

  const detectLanguage = () => {
    if (!instances.languageDetector) {
      return undefined;
    }

    const availableLanguages = getAvailableLanguages()!;

    return instances.languageDetector.getLanguage({
      availableLanguages,
    });
  };

  const getInitialLanguage = () => {
    const availableLanguages = getAvailableLanguages();
    const languageOrPromise = instances.languageStorage?.getLanguage();

    return valueOrPromise(languageOrPromise, (language) => {
      if (
        (!availableLanguages || availableLanguages.includes(language!)) &&
        language
      ) {
        return language;
      }
      return detectLanguage();
    });
  };

  const addBackend = (backend: BackendInterface | undefined) => {
    if (backend) {
      instances.backends.push(backend);
    }
  };

  const setDevBackend = (backend: BackendDevInterface | undefined) => {
    instances.devBackend = backend;
  };

  const run = (isDev: boolean) => {
    if (!instances.ui && plugins.ui) {
      const { apiKey, apiUrl, projectId } = getInitialOptions();
      instances.ui = new plugins.ui({
        apiKey: apiKey!,
        apiUrl: apiUrl!,
        projectId,
        highlight,
        changeTranslation,
      });
    }
    if (!instances.observer) {
      instances.observer = plugins.observer?.({
        translate,
        onClick,
        options: getObserverOptions(),
      });
    }
    instances.observer?.run({ mouseHighlight: isDev });
  };

  const getDevBackend = () => {
    return instances.devBackend;
  };

  const getBackendDevRecord: BackendGetRecord = ({ language, namespace }) => {
    const { apiKey, apiUrl, projectId } = getInitialOptions();
    return instances.devBackend?.getRecord({
      apiKey,
      apiUrl,
      projectId,
      language,
      namespace,
    });
  };

  const getBackendRecord: BackendGetRecord = ({ language, namespace }) => {
    for (const backend of instances.backends) {
      const data = backend.getRecord({ language, namespace });
      if (isPromise(data)) {
        return data?.catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
          return {};
        });
      }
      if (data !== undefined) {
        return data;
      }
    }
    return undefined;
  };

  const unwrap = (text: string): Unwrapped => {
    if (instances.observer) {
      return instances.observer?.unwrap(text);
    }
    return { text, keys: [] };
  };

  const retranslate = () => {
    instances.observer?.retranslate();
  };

  function getPluginTools() {
    return Object.freeze({
      setFinalFormatter,
      addFormatter,
      setObserver,
      hasObserver,
      setUi,
      hasUi,
      setDevBackend,
      addBackend,
      setLanguageDetector,
      setLanguageStorage,
    });
  }

  function addPlugin(tolgeeInstance: TolgeeInstance, plugin: TolgeePlugin) {
    plugin(tolgeeInstance, getPluginTools());
  }

  function formatTranslation({
    key,
    translation,
    defaultValue,
    noWrap,
    params,
    orEmpty,
    ns,
    formatEnabled,
  }: TranslatePropsInternal & { formatEnabled?: boolean }) {
    const formattableTranslation = translation || defaultValue;
    let result = formattableTranslation || (orEmpty ? '' : key);
    if (instances.observer && !noWrap) {
      result = instances.observer.wrap({
        key,
        translation: result,
        defaultValue,
        params,
        ns,
      });
    }

    const language = getLanguage();
    const isFormatEnabled =
      formatEnabled || !instances.observer?.outputNotFormattable;
    if (formattableTranslation && language && isFormatEnabled) {
      for (const formatter of instances.formatters) {
        result = formatter.format({
          translation: result,
          language,
          params,
        });
      }
    }

    if (
      instances.finalFormatter &&
      formattableTranslation &&
      language &&
      isFormatEnabled
    ) {
      result = instances.finalFormatter.format({
        translation: result,
        language,
        params,
      });
    }
    return result;
  }

  function hasDevBackend() {
    return Boolean(getDevBackend());
  }

  const wrap = (params: WrapperWrapProps) => {
    if (instances.observer) {
      return instances.observer?.wrap(params);
    }
    return params.translation;
  };

  return Object.freeze({
    addPlugin,
    formatTranslation,
    getDevBackend,
    getBackendRecord,
    getBackendDevRecord,
    getLanguageDetector,
    getInitialLanguage,
    setStoredLanguage,
    run,
    stop,
    retranslate,
    highlight,
    unwrap,
    wrap,
    hasDevBackend,
  });
};

export type PluginServiceType = ReturnType<typeof PluginService>;
