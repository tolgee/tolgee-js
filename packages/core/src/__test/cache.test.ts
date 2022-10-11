import { Tolgee } from '../Tolgee';
import { TolgeeInstance, TolgeePlugin, TreeTranslationsData } from '../types';
import { resolvablePromise } from './testTools';

const waitForInitialLoad = (tolgee: TolgeeInstance) =>
  new Promise<void>((resolve) => {
    const { unsubscribe } = tolgee.on('initialLoad', () => {
      unsubscribe();
      resolve();
    });
  });

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

const DevToolsThrow = (): TolgeePlugin => (tolgee, tools) => {
  tolgee.init({ apiKey: 'test', apiUrl: 'test' });
  tools.setDevBackend({
    getRecord() {
      return Promise.reject();
    },
  });
  return tolgee;
};

describe('cache', () => {
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    tolgee = Tolgee({
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

  it('ignores empty values', async () => {
    tolgee.addStaticData({
      en: { sub: { test: 'Test', null: null, undefined: undefined } },
    });
    expect(tolgee.t('sub.test')).toEqual('Test');
    expect(tolgee.t('sub.null')).toEqual('sub.null');
    expect(tolgee.t('sub.undefined')).toEqual('sub.undefined');
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

    await waitForInitialLoad(tolgee);
    expect(tolgee.t('test.sub')).toEqual('en.default.new');
  });

  it('keeps data when dev backend throws', async () => {
    const keyUpdateHandler = jest.fn();
    tolgee.on('keyUpdate', keyUpdateHandler);
    await tolgee.run();
    expect(keyUpdateHandler).toBeCalledTimes(1);
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
    tolgee.use(DevToolsThrow());
    await waitForInitialLoad(tolgee);
    expect(keyUpdateHandler).toBeCalledTimes(2);
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
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

  it('gets all records', async () => {
    await tolgee.run();
    expect(tolgee.getAllRecords().length).toEqual(2);
  });

  it('fetching works with namespaces', async () => {
    tolgee.use(DevToolsPlugin());
    const runPromise = tolgee.run();
    expect(tolgee.isFetching()).toBeTruthy();
    await runPromise;
    expect(tolgee.t('test.sub', { ns: 'common' })).toEqual('test.sub');
    const nsPromise = tolgee.addActiveNs('common');
    expect(tolgee.isFetching()).toBeTruthy();
    expect(tolgee.isFetching('common')).toBeTruthy();
    expect(tolgee.isFetching('nonexistant')).toBeFalsy();
    await nsPromise;
    expect(tolgee.t('test.sub', { ns: 'common' })).toEqual('en.common');
    expect(tolgee.isFetching()).toBeFalsy();
  });

  it("pending requests won't rewrite cache when reinitialized", async () => {
    const [promiseEn, resolveEn] = resolvablePromise<TreeTranslationsData>();
    tolgee = Tolgee({
      language: 'en',
      staticData: {
        en: () => promiseEn,
      },
    });
    tolgee.run();
    await Promise.resolve();
    tolgee.use(DevToolsPlugin());
    await waitForInitialLoad(tolgee);
    expect(tolgee.t('test.sub')).toEqual('en.default');
    resolveEn({ test: { sub: 'Invalid' } });
    await Promise.resolve();
    expect(tolgee.t('test.sub')).toEqual('en.default');
  });
});
