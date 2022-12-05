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
  it('uses plugin to fetch', async () => {
    const tolgee = TolgeeCore()
      .use(backendPlugin)
      .init({
        ns: ['common', 'test'],
        language: 'en',
      });
    await tolgee.run();
    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    tolgee.stop();
    tolgee.overrideCredentials({ apiUrl: 'asdfasdf', apiKey: 'test' });
    await tolgee.run();
    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Dev');
  });
});
