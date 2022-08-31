import {
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
  translate: (params: TranslatePropsInternal) => string
) => {
  const plugins = {
    formatter: undefined as FormatPlugin | undefined,
    observer: undefined as ObserverPlugin | undefined,
    ui: undefined as UiConstructor | undefined,
  };

  const instances = {
    formatter: undefined as ReturnType<FormatPlugin> | undefined,
    observer: undefined as ReturnType<ObserverPlugin> | undefined,
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

  const formatTranslation = ({
    key,
    translation,
    defaultValue,
    noWrap,
    params,
    orEmpty,
  }: TranslatePropsInternal) => {
    let result = translation || (orEmpty ? '' : key);
    if (instances.observer && !noWrap) {
      result = instances.observer.wrap({
        key,
        translation: result,
        defaultValue,
        params,
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
    run,
    stop,
    retranslate,
  });
};

export type PluginServiceType = ReturnType<typeof PluginService>;
