import { Tolgee } from '../Tolgee';
import { BackendPlugin } from '../types';

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

const backendNormal: BackendPlugin = () => ({
  getRecord({ language, namespace = '', dev }) {
    return data[language]?.[namespace];
  },
});

const backendDev: BackendPlugin = () => ({
  isDev: true,
  getRecord({ language, namespace = '', dev }) {
    return Promise.resolve({ cancel: 'Dev' });
  },
});

describe('backend plugins', () => {
  it('uses plugin to fetch', async () => {
    const tolgee = Tolgee({
      ns: ['common', 'test'],
      language: 'en',
    })
      .addBackend(backendNormal)
      .addBackend(backendDev);
    await tolgee.run();
    expect(tolgee.instant({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    tolgee.stop();
    tolgee.init({ apiUrl: 'asdfasdf', apiKey: 'test' });
    await tolgee.run();
    expect(tolgee.instant({ key: 'cancel', ns: 'common' })).toEqual('Dev');
  });
});
