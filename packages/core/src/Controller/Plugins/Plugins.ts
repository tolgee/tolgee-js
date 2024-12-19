import {
  getErrorMessage,
  valueOrPromise,
  handleRegularOrAsyncErr,
} from '../../helpers';
import {
  BackendDevMiddleware,
  BackendMiddleware,
  FormatterMiddleware,
  ObserverMiddleware,
  TranslatePropsInternal,
  TranslationOnClick,
  UiMiddleware,
  FinalFormatterMiddleware,
  HighlightInterface,
  UiKeyOption,
  LanguageDetectorMiddleware,
  LanguageStorageMiddleware,
  ChangeTranslationInterface,
  WrapperWrapProps,
  Unwrapped,
  KeyAndNamespacesInternal,
  TolgeePlugin,
  TolgeeInstance,
  TolgeeOptionsInternal,
  FormatErrorHandler,
  FindPositionsInterface,
  BackendGetRecordInternal,
  LanguageStorageError,
  LanguageDetectorError,
} from '../../types';
import { EventsInstance } from '../Events/Events';
import { DEFAULT_FORMAT_ERROR } from '../State/initState';

export function Plugins(
  getLanguage: () => string | undefined,
  getInitialOptions: () => TolgeeOptionsInternal,
  getAvailableLanguages: () => string[] | undefined,
  getFallbackNamespaces: (ns: string | undefined) => string[],
  getTranslationNs: (props: KeyAndNamespacesInternal) => string[],
  getTranslation: (props: KeyAndNamespacesInternal) => string | undefined,
  changeTranslation: ChangeTranslationInterface,
  events: EventsInstance
) {
  const plugins = {
    ui: undefined as UiMiddleware | undefined,
  };

  const instances = {
    formatters: [] as FormatterMiddleware[],
    finalFormatter: undefined as FinalFormatterMiddleware | undefined,
    observer: undefined as ReturnType<ObserverMiddleware> | undefined,
    devBackend: undefined as BackendDevMiddleware | undefined,
    backends: [] as BackendMiddleware[],
    ui: undefined as ReturnType<UiMiddleware> | undefined,
    languageDetector: undefined as LanguageDetectorMiddleware | undefined,
    languageStorage: undefined as LanguageStorageMiddleware | undefined,
  };

  const onClick: TranslationOnClick = async ({ keysAndDefaults, target }) => {
    const withNs: UiKeyOption[] = keysAndDefaults.map(
      ({ key, ns, defaultValue }) => {
        return {
          key,
          defaultValue,
          fallbackNamespaces: getFallbackNamespaces(ns),
          namespace: getTranslationNs({ key, ns })[0],
          translation: getTranslation({
            key,
            ns,
          }),
        };
      }
    );
    instances.ui?.handleElementClick(withNs, target);
  };

  const findPositions: FindPositionsInterface = (key, ns) => {
    return instances.observer?.findPositions(key, ns) || [];
  };

  function translate(props: TranslatePropsInternal) {
    const translation = getTranslation({
      key: props.key,
      ns: props.ns,
    });
    return self.formatTranslation({
      ...props,
      translation,
      formatEnabled: true,
    });
  }

  function getCommonProps() {
    return { fetch: getInitialOptions().fetch };
  }

  function setObserver(observer: ObserverMiddleware | undefined) {
    instances.observer = observer?.();
  }

  function hasObserver() {
    return Boolean(instances.observer);
  }

  function addFormatter(formatter: FormatterMiddleware | undefined) {
    if (formatter) {
      instances.formatters.push(formatter);
    }
  }

  function setFinalFormatter(formatter: FinalFormatterMiddleware | undefined) {
    instances.finalFormatter = formatter;
  }

  function setUi(ui: UiMiddleware | undefined) {
    plugins.ui = ui as UiMiddleware;
  }

  function hasUi() {
    return Boolean(plugins.ui);
  }

  function setLanguageStorage(storage: LanguageStorageMiddleware | undefined) {
    instances.languageStorage = storage;
  }

  function setLanguageDetector(
    detector: LanguageDetectorMiddleware | undefined
  ) {
    instances.languageDetector = detector;
  }

  function storageLoadLanguage() {
    return handleRegularOrAsyncErr(
      events.onError,
      (e) => new LanguageStorageError('Tolgee: Failed to load language', e),
      () => instances.languageStorage?.getLanguage(getCommonProps())
    );
  }

  function detectLanguage() {
    if (!instances.languageDetector) {
      return undefined;
    }

    const availableLanguages = getAvailableLanguages()!;

    return handleRegularOrAsyncErr(
      events.onError,
      (e) => new LanguageDetectorError('Tolgee: Failed to detect language', e),
      () =>
        instances.languageDetector?.getLanguage({
          availableLanguages,
          ...getCommonProps(),
        })
    );
  }

  function addBackend(backend: BackendMiddleware | undefined) {
    if (backend) {
      instances.backends.push(backend);
    }
  }

  function setDevBackend(backend: BackendDevMiddleware | undefined) {
    instances.devBackend = backend;
  }

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
    });
    plugin(tolgeeInstance, pluginTools);
  }

  const self = Object.freeze({
    addPlugin,
    findPositions: findPositions,
    run() {
      const {
        apiKey,
        apiUrl,
        projectId,
        observerOptions,
        tagNewKeys,
        filterTag,
      } = getInitialOptions();
      instances.ui = plugins.ui?.({
        apiKey: apiKey!,
        apiUrl: apiUrl!,
        projectId,
        highlight: self.highlight,
        changeTranslation,
        findPositions,
        onPermanentChange: (data) => events.onPermanentChange.emit(data),
        tagNewKeys,
        filterTag,
      });

      instances.observer?.run({
        mouseHighlight: true,
        options: observerOptions,
        translate,
        onClick,
      });
    },

    stop() {
      instances.ui = undefined;
      instances.observer?.stop();
    },

    getLanguageStorage() {
      return instances.languageStorage;
    },

    getInitialLanguage() {
      const availableLanguages = getAvailableLanguages();
      const languageOrPromise = storageLoadLanguage();

      return valueOrPromise(languageOrPromise, (language) => {
        if (
          (!availableLanguages || availableLanguages.includes(language!)) &&
          language
        ) {
          return language;
        }
        return detectLanguage();
      });
    },

    setStoredLanguage(language: string) {
      return handleRegularOrAsyncErr(
        events.onError,
        (e) => new LanguageStorageError('Tolgee: Failed to store language', e),
        () => instances.languageStorage?.setLanguage(language, getCommonProps())
      );
    },

    getDevBackend() {
      return instances.devBackend;
    },

    getBackendRecord: (async ({ language, namespace }) => {
      for (const backend of instances.backends) {
        const data = await backend.getRecord({
          language,
          namespace,
          ...getCommonProps(),
        });
        if (data !== undefined) {
          return data;
        }
      }
      return undefined;
    }) as BackendGetRecordInternal,

    getBackendDevRecord: (async ({ language, namespace }) => {
      const { apiKey, apiUrl, projectId, filterTag } = getInitialOptions();

      if (!apiKey || !apiUrl || !self.hasDevBackend()) {
        return undefined;
      }

      return instances.devBackend?.getRecord({
        apiKey,
        apiUrl,
        projectId,
        language,
        namespace,
        filterTag,
        ...getCommonProps(),
      });
    }) as BackendGetRecordInternal,

    getLanguageDetector() {
      return instances.languageDetector;
    },

    retranslate() {
      instances.observer?.retranslate();
    },

    highlight: ((key, ns) => {
      return instances.observer?.highlight?.(key, ns) || { unhighlight() {} };
    }) as HighlightInterface,

    unwrap(text: string): Unwrapped {
      if (instances.observer) {
        return instances.observer?.unwrap(text);
      }
      return { text, keys: [] };
    },

    wrap(params: WrapperWrapProps) {
      if (instances.observer) {
        return instances.observer?.wrap(params);
      }
      return params.translation;
    },

    hasDevBackend() {
      return Boolean(self.getDevBackend());
    },

    formatTranslation({
      formatEnabled,
      ...props
    }: TranslatePropsInternal & { formatEnabled?: boolean }) {
      const { key, translation, defaultValue, noWrap, params, ns, orEmpty } =
        props;

      const formattableTranslation = translation ?? defaultValue;

      let translationMissingResult = '';

      if (translation === undefined || translation === null) {
        // called when translation is missing
        // return value is used when 'defaultValue' and 'orEmpty' are not defined
        translationMissingResult =
          getInitialOptions().onTranslationMissing(props);
      }

      let result =
        formattableTranslation ?? (orEmpty ? '' : translationMissingResult);

      const language = getLanguage();
      const isFormatEnabled =
        formatEnabled || !instances.observer?.outputNotFormattable;

      const wrap = (result: string) => {
        if (instances.observer && !noWrap) {
          return instances.observer.wrap({
            key,
            translation: result,
            defaultValue,
            params,
            ns,
          });
        }
        return result;
      };

      result = wrap(result);
      try {
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
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e);
        const errorMessage = getErrorMessage(e) || DEFAULT_FORMAT_ERROR;
        const onFormatError = getInitialOptions().onFormatError;
        const formatErrorType = typeof onFormatError;
        if (formatErrorType === 'string') {
          result = onFormatError as string;
        } else if (formatErrorType === 'function') {
          result = (onFormatError as FormatErrorHandler)(errorMessage, props);
        } else {
          result = DEFAULT_FORMAT_ERROR;
        }
        // wrap error message, so it's detectable
        result = wrap(result);
      }

      return result;
    },
  });
  return self;
}

export type PluginsInstance = ReturnType<typeof Plugins>;
