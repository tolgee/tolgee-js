import {
  BackendDevInterface,
  BackendGetRecord,
  BackendInterface,
  BackendDevProps,
  FormatterInterface,
  ObserverInterface,
  TranslatePropsInternal,
  TranslationOnClick,
  UiInterface,
  UiLibInterface,
  UiType,
  FinalFormatterInterface,
  UiProps,
  HighlightInterface,
  UiConstructor,
  UiKeyOption,
} from '../../types';
import { getFallback } from '../State/helpers';

export const PluginService = (
  getLocale: () => string,
  translate: (params: TranslatePropsInternal) => string,
  getBackendProps: () => BackendDevProps,
  getUiProps: () => UiProps,
  getTranslationNs: (props: TranslatePropsInternal) => string[] | string
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
    ui: undefined as UiInterface | undefined,
  };

  const onClick: TranslationOnClick = async (event, { keysAndDefaults }) => {
    const withNs: UiKeyOption[] = keysAndDefaults.map(
      ({ key, ns, defaultValue }) => ({
        key,
        defaultValue,
        ns: getFallback(getTranslationNs({ key, ns, defaultValue })),
        translation: translate({
          key,
          noWrap: true,
          orEmpty: true,
        }),
      })
    );
    instances.ui?.handleElementClick(event, withNs);
  };

  const run = (isDev: boolean) => {
    instances.ui = plugins.ui && new plugins.ui(getUiProps());
    instances.observer?.run();
  };

  const stop = (isDev: boolean) => {
    instances.ui = undefined;
    instances.observer?.stop();
  };

  const highlight: HighlightInterface = (key) => {
    return instances.observer?.highlight?.(key) || { unhighlight() {} };
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
    highlight,
  });
};

export type PluginServiceType = ReturnType<typeof PluginService>;
