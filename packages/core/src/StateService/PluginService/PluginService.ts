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
} from '../../types';

export const PluginService = (
  getLocale: () => string,
  translate: (params: TranslatePropsInternal) => string,
  getBackendProps: () => BackendDevProps
) => {
  const plugins = {
    observer: undefined as ObserverPlugin | undefined,
    ui: undefined as UiConstructor | undefined,
  };

  const instances = {
    formatter: undefined as FormatterPlugin | undefined,
    observer: undefined as ReturnType<ObserverPlugin> | undefined,
    devBackend: TolgeeBackend as BackendDevPlugin | undefined,
    backends: [] as BackendPlugin[],
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

  const setObserver = (observer: ObserverPlugin | undefined) => {
    plugins.observer = observer;
  };

  const setFormatter = (formatter: FormatterPlugin | undefined) => {
    instances.formatter = formatter;
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
    if (instances.formatter && formattableTranslation) {
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
    setFormatter,
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
