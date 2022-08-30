import { FormatPlugin, ObserverPlugin, TranslateProps } from '../types';

export const PluginService = (
  getLocale: () => string,
  translate: (params: TranslateProps) => string
) => {
  const plugins = {
    formatter: undefined as FormatPlugin | undefined,
    observer: undefined as ObserverPlugin | undefined,
  };

  const instances = {
    formatter: undefined as ReturnType<FormatPlugin> | undefined,
    observer: undefined as ReturnType<ObserverPlugin> | undefined,
  };

  const run = () => {
    instances.observer = plugins?.observer?.({ translate });
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

  const formatTranslation = ({
    key,
    translation,
    defaultValue,
    noWrap,
    params,
  }: TranslateProps) => {
    if (!translation) {
      return key;
    }
    let result = translation;
    if (instances.observer && !noWrap) {
      result = instances.observer.wrap({
        key,
        translation: result,
        defaultValue,
        params,
      });
    }
    if (instances.formatter) {
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
    run,
    stop,
    retranslate,
  });
};

export type PluginServiceType = ReturnType<typeof PluginService>;
