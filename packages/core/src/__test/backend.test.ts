/* eslint-disable no-console */
import { TolgeeCore } from '../TolgeeCore';
import { BackendMiddleware, TolgeePlugin } from '../types';

const data = {
  en: {
    common: { cancel: 'Cancel' },
    test: { test: 'Test' },
  },
  es: {
    common: { cancel: 'Cancellar' },
    test: { test: 'Testar' },
  },
} as any;

const backendReturningUndefined: BackendMiddleware = {
  async getRecord() {
    return Promise.resolve(undefined);
  },
};

const backendThrowing: BackendMiddleware = {
  async getRecord() {
    throw new Error('Failed to fetch');
  },
};

const backendNormal: BackendMiddleware = {
  getRecord({ language, namespace = '' }) {
    return data[language]?.[namespace];
  },
};

const backendDev: BackendMiddleware = {
  getRecord() {
    return Promise.resolve({ cancel: 'Dev' });
  },
};

const backendPlugin: TolgeePlugin = (tolgee, tools) => {
  tools.addBackend(backendNormal);
  tools.setDevBackend(backendDev);
  return tolgee;
};

describe('backend plugins', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('uses plugin to fetch', async () => {
    const tolgee = TolgeeCore()
      .use(backendPlugin)
      .init({
        ns: ['common', 'test'],
        defaultNs: 'common',
        language: 'en',
      });
    await tolgee.run();
    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    tolgee.stop();
    tolgee.overrideCredentials({ apiUrl: 'asdfasdf', apiKey: 'test' });
    await tolgee.run();
    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Dev');
  });

  it('falls back if backend returns undefined', async () => {
    const tolgee = TolgeeCore()
      .use((tolgee, tools) => {
        tools.addBackend(backendReturningUndefined);
        tools.addBackend(backendNormal);
        return tolgee;
      })
      .init({
        ns: ['common', 'test'],
        defaultNs: 'common',
        language: 'en',
      });
    await tolgee.run();
    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    tolgee.stop();
  });

  it('uses backends in correct order', async () => {
    const tolgee = TolgeeCore()
      .use((tolgee, tools) => {
        tools.addBackend(backendThrowing);
        tools.addBackend(backendNormal);
        return tolgee;
      })
      .init({
        ns: ['common', 'test'],
        defaultNs: 'common',
        language: 'en',
      });
    const errLogger = console.error;
    console.error = jest.fn();
    await expect(() => tolgee.run()).rejects.toThrow('Failed to fetch');
    console.error = errLogger;
    tolgee.stop();
  });

  it('uses backends in correct order 2', async () => {
    const tolgee = TolgeeCore()
      .use((tolgee, tools) => {
        tools.addBackend(backendNormal);
        tools.addBackend(backendThrowing);
        return tolgee;
      })
      .init({
        ns: ['common', 'test'],
        defaultNs: 'common',
        language: 'en',
      });

    await tolgee.run();
    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    tolgee.stop();
  });
});
