import { getErrorMessage, isPromise, valueOrPromise } from '../../helpers';
import {
  BackendDevMiddleware,
  BackendGetRecord,
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
  ParamsFormatterMiddleware,
} from '../../types';
import { DEFAULT_FORMAT_ERROR } from '../State/initState';

export function Plugins(
  getLanguage: () => string | undefined,
  getInitialOptions: () => TolgeeOptionsInternal,
  getAvailableLanguages: () => string[] | undefined,
  getTranslationNs: (props: KeyAndNamespacesInternal) => string[],
  getTranslation: (props: KeyAndNamespacesInternal) => string | undefined,
  changeTranslation: ChangeTranslationInterface
) {
  const plugins = {
    ui: undefined as UiMiddleware | undefined,
  };

  const instances = {
    formatters: [] as FormatterMiddleware[],
    paramsFormatters: [] as ParamsFormatterMiddleware[],
    finalFormatter: undefined as FinalFormatterMiddleware | undefined,
    observer: undefined as ReturnType<ObserverMiddleware> | undefined,
    devBackend: undefined as BackendDevMiddleware | undefined,
    backends: [] as BackendMiddleware[],
    ui: undefined as ReturnType<UiMiddleware> | undefined,
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

  function addParamsFormatter(
    formatter: ParamsFormatterMiddleware | undefined
  ) {
    if (formatter) {
      instances.paramsFormatters.push(formatter);
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

  function detectLanguage() {
    if (!instances.languageDetector) {
      return undefined;
    }

    const availableLanguages = getAvailableLanguages()!;

    return instances.languageDetector.getLanguage({
      availableLanguages,
    });
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
      addParamsFormatter,
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

  function handleFormatError(
    e: any,
    result: string,
    props: TranslatePropsInternal
  ) {
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
    return result;
  }

  const self = Object.freeze({
    addPlugin: addPlugin,

    run() {
      const { apiKey, apiUrl, projectId, observerOptions } =
        getInitialOptions();
      instances.ui = plugins.ui?.({
        apiKey: apiKey!,
        apiUrl: apiUrl!,
        projectId,
        highlight: self.highlight,
        changeTranslation,
        findPositions,
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
    },

    setStoredLanguage(language: string) {
      instances.languageStorage?.setLanguage(language);
    },

    getDevBackend() {
      return instances.devBackend;
    },

    getBackendRecord: (({ language, namespace }) => {
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
    }) as BackendGetRecord,

    getBackendDevRecord: (({ language, namespace }) => {
      const { apiKey, apiUrl, projectId } = getInitialOptions();
      return instances.devBackend?.getRecord({
        apiKey,
        apiUrl,
        projectId,
        language,
        namespace,
      });
    }) as BackendGetRecord,

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
      const { key, translation, defaultValue, noWrap, orEmpty, ns } = props;
      const formattableTranslation = translation || defaultValue;
      let result = formattableTranslation || (orEmpty ? '' : key);

      const language = getLanguage();
      const isFormatEnabled =
        formatEnabled || !instances.observer?.outputNotFormattable;

      let params = props.params || {};

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

      try {
        if (language) {
          for (const formatter of instances.paramsFormatters) {
            params = formatter.format({ language, params });
          }
        }
      } catch (e: any) {
        result = handleFormatError(e, result, props);
        // wrap error message, so it's detectable
        return wrap(result);
      }

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
        result = handleFormatError(e, result, props);
        // wrap error message, so it's detectable
        return wrap(result);
      }

      return result;
    },
  });
  return self;
}

export type PluginsInstance = ReturnType<typeof Plugins>;
