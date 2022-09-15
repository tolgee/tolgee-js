import {
  BackendDevInterface,
  BackendGetRecord,
  BackendInterface,
  BackendDevProps,
  FormatterInterface,
  ObserverInterface,
  TranslatePropsInternal,
  TranslationOnClick,
  UiInstance,
  UiLibInterface,
  UiType,
  FinalFormatterInterface,
  UiProps,
  HighlightByKeyType,
  UiConstructor,
} from '../../types';

export const PluginService = (
  getLocale: () => string,
  translate: (params: TranslatePropsInternal) => string,
  getBackendProps: () => BackendDevProps,
  getUiProps: () => UiProps
) => {
  const plugins = {
    ui: undefined as UiConstructor | undefined,
  };

  const instances = {
    formatters: [] as FormatterInterface[],
    finalFormatter: undefined as FinalFormatterInterface | undefined,
    observer: undefined as ReturnType<ObserverInterface> | undefined,
    devBackend: undefined as BackendDevInterface | undefined,
    backends: [] as BackendInterface[],
    ui: undefined as UiInstance | undefined,
  };

  const onClick: TranslationOnClick = async (event, { keysAndDefaults }) => {
    instances.ui?.handleElementClick(event, keysAndDefaults);
  };

  const run = () => {
    instances.ui =
      plugins.ui &&
      new plugins.ui({
        ...getUiProps(),
        highlightByKey,
      });
    instances.observer?.run();
  };

  const stop = () => {
    instances.ui = undefined;
    instances.observer?.stop();
  };

  const highlightByKey: HighlightByKeyType = (key) => {
    return instances.observer?.highlightByKey?.(key) || { unhighlight() {} };
  };

  const setObserver = (observer: ObserverInterface | undefined) => {
    instances.observer = observer?.({ translate, onClick });
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

  const addBackend = (backend: BackendInterface | undefined) => {
    if (backend) {
      instances.backends.push(backend);
    }
  };

  const setDevBackend = (backend: BackendDevInterface | undefined) => {
    instances.devBackend = backend;
  };

  const getDevBackend = () => {
    return instances.devBackend;
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
    getDevBackend,
    getBackendRecord,
    getBackendDevRecord,
    run,
    stop,
    retranslate,
  });
};

export type PluginServiceType = ReturnType<typeof PluginService>;
