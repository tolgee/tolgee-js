import { FormatPlugin, ObserverPlugin } from '../types';

export const PluginService = (getLocale: () => string) => {
  const plugins = {
    formatter: undefined as FormatPlugin | undefined,
    observer: undefined as ObserverPlugin | undefined,
  };

  const instances = {
    formatter: undefined as ReturnType<FormatPlugin> | undefined,
    observer: undefined as ReturnType<ObserverPlugin> | undefined,
  };

  const run = () => {
    instances.observer = plugins?.observer?.();
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

  const formatTranslation = (
    key: string,
    translation: string | undefined,
    defaultValue?: string
  ) => {
    if (!translation) {
      return key;
    }
    let result = translation;
    if (instances.observer) {
      result = instances.observer.wrap(key, result, undefined, defaultValue);
    }
    if (instances.formatter) {
      result = instances.formatter.format({
        translation: result,
        language: getLocale(),
        params: undefined,
      });
    }
    return result;
  };

  return Object.freeze({
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
