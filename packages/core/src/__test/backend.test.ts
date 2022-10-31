import { Tolgee } from '../Tolgee';
import { BackendInterface } from '../types';
import { TolgeePlugin } from '../types/plugin';

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

const backendNormal: BackendInterface = {
  getRecord({ language, namespace = '' }) {
    return data[language]?.[namespace];
  },
};

const backendDev: BackendInterface = {
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
    const tolgee = Tolgee()
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
