import { FormatPlugin, ObserverPlugin, WrapperPlugin } from '../types';

export const PluginService = (getLocale: () => string) => {
  const plugins = {
    wrapper: undefined as ReturnType<WrapperPlugin> | undefined,
    formatter: undefined as ReturnType<FormatPlugin> | undefined,
    observer: undefined as ReturnType<ObserverPlugin> | undefined,
  };

  const run = () => {
    plugins.observer?.run();
  };

  const stop = () => {
    plugins.observer?.stop();
  };

  const getObserver = () => {
    return plugins.observer;
  };

  const setObserver = (observer: ObserverPlugin) => {
    plugins.observer = observer();
  };

  const getWrapper = () => {
    return plugins.wrapper;
  };

  const setWrapper = (wrapper: WrapperPlugin | undefined) => {
    if (wrapper) {
      plugins.wrapper = wrapper();
    }
  };

  const getFormat = () => {
    return plugins.formatter;
  };

  const setFormat = (formatter: FormatPlugin | undefined) => {
    if (formatter) {
      plugins.formatter = formatter();
    }
  };

  const formatTranslation = (
    key: string,
    translation: string | undefined,
    defaultValue?: string
  ) => {
    if (!translation) {
      return key;
    }
    let result = translation;
    if (plugins.wrapper) {
      result = plugins.wrapper.wrap(key, result, undefined, defaultValue);
    }
    if (plugins.formatter) {
      result = plugins.formatter.format({
        translation: result,
        language: getLocale(),
        params: undefined,
      });
    }
    return result;
  };

  return Object.freeze({
    getWrapper,
    setWrapper,
    getFormat,
    setFormat,
    formatTranslation,
    getObserver,
    setObserver,
    run,
    stop,
  });
};

export type PluginServiceType = ReturnType<typeof PluginService>;
