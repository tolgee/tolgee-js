import { Tolgee } from '../Tolgee';
import { TolgeeInstance, TolgeePlugin } from '../types';

const DevToolsPlugin =
  (postfix = ''): TolgeePlugin =>
  (tolgee, tools) => {
    tolgee.init({ apiKey: 'test', apiUrl: 'test' });
    tools.setDevBackend({
      getRecord({ language, namespace }) {
        return Promise.resolve({
          test: { sub: `${language}.${namespace || 'default'}${postfix}` },
        });
      },
    });
    return tolgee;
  };

describe('cache', () => {
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    tolgee = Tolgee().init({
      language: 'en',
      staticData: {
        en: { test: { sub: 'subtestEn' } },
        cs: { 'test.sub': 'subtestCs' },
      },
    });
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('stores initial data correctly', async () => {
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
    await tolgee.changeLanguage('cs');
    expect(tolgee.t('test.sub')).toEqual('subtestCs');
  });

  it('returns correct data when in dev mode', async () => {
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
    tolgee.use(DevToolsPlugin());
    await tolgee.run();
    expect(tolgee.t('test.sub')).toEqual('en.default');
    const changeLangPromise = tolgee.changeLanguage('cs');
    expect(tolgee.t('test.sub')).toEqual('en.default');
    await changeLangPromise;
    expect(tolgee.t('test.sub')).toEqual('cs.default');
  });

  it('invalidates the cache when switching to dev', async () => {
    await tolgee.run();
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
    tolgee.use(DevToolsPlugin());
    expect(tolgee.t('test.sub')).toEqual('subtestEn');

    await new Promise<void>((resolve) => {
      const { unsubscribe } = tolgee.on('initialLoad', async () => {
        expect(tolgee.t('test.sub')).toEqual('en.default');
        unsubscribe();
        resolve();
      });
    });
  });

  it('works with switching to different dev backend', async () => {
    tolgee.use(DevToolsPlugin());
    await tolgee.run();
    expect(tolgee.t('test.sub')).toEqual('en.default');
    tolgee.use(DevToolsPlugin('.new'));
    expect(tolgee.t('test.sub')).toEqual('en.default');

    await new Promise<void>((resolve) => {
      const { unsubscribe } = tolgee.on('initialLoad', async () => {
        expect(tolgee.t('test.sub')).toEqual('en.default.new');
        unsubscribe();
        resolve();
      });
    });
  });

  it('updates initial data correctly', async () => {
    await tolgee.run();
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
    tolgee.addStaticData({ en: { test: { sub: 'newSubtestEn' } } });
    expect(tolgee.t('test.sub')).toEqual('newSubtestEn');
  });

  it('ignores new initial data when already in dev mode', async () => {
    tolgee.use(DevToolsPlugin());
    await tolgee.run();
    expect(tolgee.t('test.sub')).toEqual('en.default');
    tolgee.addStaticData({ en: { test: { sub: 'newSubtestEn' } } });
    expect(tolgee.t('test.sub')).toEqual('en.default');
  });
});
