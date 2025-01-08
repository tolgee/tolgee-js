import { TolgeePlugin } from '../types';

export const resolvablePromise = <T = any>() => {
  let resolve: (value: T) => void;
  const promise = new Promise<T>((innerResolve) => {
    resolve = innerResolve;
  });
  return [promise, resolve!] as const;
};

export const DevToolsPlugin =
  (suffix = ''): TolgeePlugin =>
  (tolgee, tools) => {
    tolgee.updateOptions({ apiKey: 'test', apiUrl: 'test' });
    tools.setDevBackend({
      getRecord({ language, namespace }) {
        return Promise.resolve({
          test: { sub: `${language}.${namespace || 'default'}${suffix}` },
        });
      },
    });
    return tolgee;
  };

export const BackendPlugin =
  (suffix = ''): TolgeePlugin =>
  (tolgee, tools) => {
    tools.addBackend({
      getRecord({ language, namespace }) {
        return Promise.resolve({
          test: { sub: `${language}.${namespace || 'default'}${suffix}` },
        });
      },
    });
    return tolgee;
  };

export const DevToolsThrow = (): TolgeePlugin => (tolgee, tools) => {
  tolgee.updateOptions({ apiKey: 'test', apiUrl: 'test' });
  tools.setDevBackend({
    getRecord() {
      return Promise.reject();
    },
  });
  return tolgee;
};
