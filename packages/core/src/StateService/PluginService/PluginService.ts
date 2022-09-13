import { TolgeeBackend } from '../../TolgeeBackend';
import {
  BackendDevPlugin,
  BackendGetRecord,
  BackendPlugin,
  BackendDevProps,
  FormatterPlugin,
  ObserverPlugin,
  TranslatePropsInternal,
  TranslationOnClick,
  UiConstructor,
  UiInstance,
  UiLibInterface,
  UiType,
  FinalFormatterPlugin,
  UiProps,
} from '../../types';

export const PluginService = (
  getLocale: () => string,
  translate: (params: TranslatePropsInternal) => string,
  getBackendProps: () => BackendDevProps,
  getUiProps: () => UiProps
) => {
  const plugins = {
    observer: undefined as ObserverPlugin | undefined,
    ui: undefined as UiConstructor | undefined,
  };

  const instances = {
    formatters: [] as FormatterPlugin[],
    finalFormatter: undefined as FinalFormatterPlugin | undefined,
    observer: undefined as ReturnType<ObserverPlugin> | undefined,
    devBackend: TolgeeBackend as BackendDevPlugin | undefined,
    backends: [] as BackendPlugin[],
    ui: undefined as UiInstance | undefined,
  };

  const onClick: TranslationOnClick = async (event, { keysAndDefaults }) => {
    instances.ui?.handleElementClick(event, keysAndDefaults);
  };

  const run = () => {
    instances.observer = plugins?.observer?.({ translate, onClick });
    instances.ui =
      plugins.ui &&
      new plugins.ui({
        ...getUiProps(),
        highlightByKey: instances.observer?.highlightByKey,
      });
  };

  const stop = () => {
    instances.observer?.stop();
    instances.observer = undefined;
  };

  const setObserver = (observer: ObserverPlugin | undefined) => {
    plugins.observer = observer;
  };

  const addFormatter = (formatter: FormatterPlugin | undefined) => {
    if (formatter) {
      instances.formatters.push(formatter);
    }
  };

  const setFinalFormatter = (formatter: FinalFormatterPlugin | undefined) => {
    instances.finalFormatter = formatter;
  };

  const setUi = (ui: UiType | undefined) => {
    plugins.ui = (ui as UiLibInterface)?.UI || ui;
  };

  const addBackend = (backend: BackendPlugin | undefined) => {
    if (backend) {
      instances.backends.push(backend);
    }
  };

  const setDevBackend = (backend: BackendDevPlugin | undefined) => {
    instances.devBackend = backend;
  };

  const getBackendDevRecord: BackendGetRecord = ({ language, namespace }) => {
    return instances.devBackend?.getRecord({
      ...getBackendProps(),
      language,
      namespace,
    });
  };

  const getBackendRecord: BackendGetRecord = ({ language, namespace }) => {
    for (const backend of instances.backends) {
      const data = backend.getRecord({ language, namespace });
      if (data !== undefined) {
        return data;
      }
    }
    return undefined;
  };

  const formatTranslation = ({
    key,
    translation,
    defaultValue,
    noWrap,
    params,
    orEmpty,
    ns,
  }: TranslatePropsInternal) => {
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

    if (formattableTranslation) {
      for (const formatter of instances.formatters) {
        result = formatter.format({
          translation: result,
          language: getLocale(),
          params,
        });
      }
    }

    if (instances.finalFormatter && formattableTranslation) {
      result = instances.finalFormatter.format({
        translation: result,
        language: getLocale(),
        params,
      });
    }
    return result;
  };

  const retranslate = () => {
    instances.observer?.retranslate();
  };

  return Object.freeze({
    setFinalFormatter,
    addFormatter,
    formatTranslation,
    setObserver,
    setUi,
    addBackend,
    setDevBackend,
    getBackendRecord,
    getBackendDevRecord,
    run,
    stop,
    retranslate,
  });
};

export type PluginServiceType = ReturnType<typeof PluginService>;
