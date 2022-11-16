import { isPromise, valueOrPromise } from '../../helpers';
import {
  BackendDevMiddleware,
  BackendGetRecord,
  BackendMiddleware,
  FormatterMiddleware,
  ObserverMiddleware,
  TranslatePropsInternal,
  TranslationOnClick,
  UiMiddleware,
  UiLibMiddleware,
  UiType,
  FinalFormatterMiddleware,
  HighlightInterface,
  UiConstructor,
  UiKeyOption,
  LanguageDetectorMiddleware,
  LanguageStorageMiddleware,
  ChangeTranslationInterface,
  WrapperWrapProps,
  Unwrapped,
  KeyAndNamespacesInternal,
  TolgeePlugin,
  TolgeeInstance,
} from '../../types';
import { TolgeeOptionsInternal } from '../State/initState';

export const Plugins = (
  getLanguage: () => string | undefined,
  getInitialOptions: () => TolgeeOptionsInternal,
  getAvailableLanguages: () => string[] | undefined,
  getTranslationNs: (props: KeyAndNamespacesInternal) => string[],
  getTranslation: (props: KeyAndNamespacesInternal) => string | undefined,
  changeTranslation: ChangeTranslationInterface
) => {
  let prepared = false;
  let onPrepareQueue: (() => void)[] = [];
  const plugins = {
    ui: undefined as UiConstructor | undefined,
    observer: undefined as ObserverMiddleware | undefined,
  };

  const instances = {
    formatters: [] as FormatterMiddleware[],
    finalFormatter: undefined as FinalFormatterMiddleware | undefined,
    observer: undefined as ReturnType<ObserverMiddleware> | undefined,
    devBackend: undefined as BackendDevMiddleware | undefined,
    backends: [] as BackendMiddleware[],
    ui: undefined as UiMiddleware | undefined,
    languageDetector: undefined as LanguageDetectorMiddleware | undefined,
    languageStorage: undefined as LanguageStorageMiddleware | undefined,
  };

  const onClick: TranslationOnClick = async ({ keysAndDefaults, event }) => {
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
    instances.ui?.handleElementClick(withNs, event);
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

  const setObserver = (observer: ObserverMiddleware | undefined) => {
    plugins.observer = observer;
  };

  const hasObserver = () => {
    return Boolean(plugins.observer);
  };

  const addFormatter = (formatter: FormatterMiddleware | undefined) => {
    if (formatter) {
      instances.formatters.push(formatter);
    }
  };

  const setFinalFormatter = (
    formatter: FinalFormatterMiddleware | undefined
  ) => {
    instances.finalFormatter = formatter;
  };

  const setUi = (ui: UiType | undefined) => {
    plugins.ui = (ui as UiLibMiddleware)?.UI || ui;
  };

  const hasUi = () => {
    return Boolean(plugins.ui);
  };

  const setLanguageStorage = (
    storage: LanguageStorageMiddleware | undefined
  ) => {
    instances.languageStorage = storage;
  };

  const setStoredLanguage = (language: string) => {
    instances.languageStorage?.setLanguage(language);
  };

  const setLanguageDetector = (
    detector: LanguageDetectorMiddleware | undefined
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

  const addBackend = (backend: BackendMiddleware | undefined) => {
    if (backend) {
      instances.backends.push(backend);
    }
  };

  const setDevBackend = (backend: BackendDevMiddleware | undefined) => {
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
        options: getInitialOptions().observerOptions,
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

  const onPrepare = (callback: () => void) => {
    onPrepareQueue.push(callback);
  };

  function addPlugin(tolgeeInstance: TolgeeInstance, plugin: TolgeePlugin) {
    const pluginTools = Object.freeze({
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
      onPrepare,
    });
    plugin(tolgeeInstance, pluginTools);
    if (prepared) {
      prepare();
    }
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

  function prepare() {
    prepared = true;
    while (onPrepareQueue.length) {
      const queue = onPrepareQueue;
      onPrepareQueue = [];
      queue.forEach((callback) => callback());
    }
  }

  return Object.freeze({
    prepare,
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

export type PluginsInstance = ReturnType<typeof Plugins>;
