import { TolgeeBackend } from '../backends/TolgeeBackend';
import {
  BackendDevPlugin,
  BackendGetRecord,
  BackendPlugin,
  BackendDevProps,
  FormatPlugin,
  ObserverPlugin,
  TranslatePropsInternal,
  TranslationOnClick,
  UiConstructor,
  UiInstance,
  UiLibInterface,
  UiType,
} from '../types';

export const PluginService = (
  getLocale: () => string,
  translate: (params: TranslatePropsInternal) => string,
  getBackendProps: () => BackendDevProps
) => {
  const plugins = {
    formatter: undefined as FormatPlugin | undefined,
    observer: undefined as ObserverPlugin | undefined,
    devBackend: TolgeeBackend as BackendDevPlugin | undefined,
    backends: [] as BackendPlugin[],
    ui: undefined as UiConstructor | undefined,
  };

  const instances = {
    formatter: undefined as ReturnType<FormatPlugin> | undefined,
    observer: undefined as ReturnType<ObserverPlugin> | undefined,
    devBackend: undefined as ReturnType<BackendDevPlugin> | undefined,
    backends: [] as ReturnType<BackendPlugin>[],
    ui: undefined as UiInstance | undefined,
  };

  const onClick: TranslationOnClick = async (event, { keysAndDefaults }) => {
    instances.ui?.handleElementClick(event, keysAndDefaults);
  };

  const run = () => {
    instances.ui =
      plugins.ui &&
      new plugins.ui({ getTranslation: (key) => translate({ key }) });
    instances.observer = plugins?.observer?.({ translate, onClick });
  };

  const stop = () => {
    instances.observer?.stop();
    instances.observer = undefined;
  };

  const getObserver = () => {
    return plugins.observer;
  };

  const setObserver = (observer: ObserverPlugin | undefined) => {
    plugins.observer = observer;
  };

  const getFormat = () => {
    return plugins.formatter;
  };

  const setFormat = (formatter: FormatPlugin | undefined) => {
    if (formatter) {
      plugins.formatter = formatter;
      instances.formatter = formatter();
    }
  };

  const setUi = (ui: UiType | undefined) => {
    plugins.ui = (ui as UiLibInterface)?.UI || ui;
  };

  const addBackend = (backend: BackendPlugin | undefined) => {
    if (backend) {
      plugins.backends.push(backend);
    }
  };

  const setDevBackend = (backend: BackendDevPlugin | undefined) => {
    plugins.devBackend = backend;
  };

  const makeBackendsReady = () => {
    if (!instances.devBackend && plugins.devBackend) {
      instances.devBackend = plugins.devBackend(getBackendProps());
    }
    if (plugins.backends.length !== instances.backends.length) {
      instances.backends = plugins.backends.map((backend) => backend());
    }
  };

  const getBackendDevRecord: BackendGetRecord = ({ language, namespace }) => {
    makeBackendsReady();
    return instances.devBackend?.getRecord({ language, namespace });
  };

  const getBackendRecord: BackendGetRecord = ({ language, namespace }) => {
    makeBackendsReady();
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
    let result = translation || (orEmpty ? '' : key);
    if (instances.observer && !noWrap) {
      result = instances.observer.wrap({
        key,
        translation: result,
        defaultValue,
        params,
        ns,
      });
    }
    if (instances.formatter && translation) {
      result = instances.formatter.format({
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
    getFormat,
    setFormat,
    formatTranslation,
    getObserver,
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
