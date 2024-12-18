/* eslint-disable no-console */
import { TolgeeCore, TolgeeInstance } from '../TolgeeCore';
import { TreeTranslationsData } from '../types';
import { DevToolsPlugin, DevToolsThrow, resolvablePromise } from './testTools';

function waitForInitialLoad(tolgee: TolgeeInstance) {
  return new Promise<void>((resolve) => {
    const { unsubscribe } = tolgee.on('initialLoad', () => {
      unsubscribe();
      resolve();
    });
  });
}

describe('cache', () => {
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    tolgee = TolgeeCore().init({
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
    tolgee.addPlugin(DevToolsPlugin());
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
    tolgee.addPlugin(DevToolsPlugin());
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
    tolgee.addPlugin(DevToolsPlugin());
    await tolgee.run();
    expect(tolgee.t('test.sub')).toEqual('en.default');
    tolgee.addPlugin(DevToolsPlugin('.new'));
    expect(tolgee.t('test.sub')).toEqual('en.default');

    await waitForInitialLoad(tolgee);
    expect(tolgee.t('test.sub')).toEqual('en.default.new');
  });

  it('keeps data when dev backend throws', async () => {
    console.warn = jest.fn();
    const keyUpdateHandler = jest.fn();
    tolgee.on('update', keyUpdateHandler);
    await tolgee.run();
    expect(keyUpdateHandler).toBeCalledTimes(1);
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
    tolgee.addPlugin(DevToolsThrow());
    await waitForInitialLoad(tolgee);
    expect(keyUpdateHandler).toBeCalledTimes(2);
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
    expect(console.warn).toBeCalledTimes(1);
  });

  it('updates initial data correctly', async () => {
    await tolgee.run();
    expect(tolgee.t('test.sub')).toEqual('subtestEn');
    tolgee.addStaticData({ en: { test: { sub: 'newSubtestEn' } } });
    expect(tolgee.t('test.sub')).toEqual('newSubtestEn');
  });

  it('ignores new initial data when already in dev mode', async () => {
    tolgee.addPlugin(DevToolsPlugin());
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
    tolgee.addPlugin(DevToolsPlugin());
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

  it('works with namespaces containing colon', async () => {
    const [promiseEn, resolveEn] = resolvablePromise<TreeTranslationsData>();
    tolgee.updateOptions({
      language: 'en',
      staticData: {
        'en:common:test': () => promiseEn,
      },
    });
    await tolgee.run();
    expect(tolgee.t('test.sub', { ns: 'common:test' })).toEqual('test.sub');
    const nsPromise = tolgee.addActiveNs('common:test');
    expect(tolgee.isLoading('common:test')).toBeTruthy();
    resolveEn({ test: { sub: 'Test' } });
    await nsPromise;
    expect(tolgee.t('test.sub', { ns: 'common:test' })).toEqual('Test');
  });

  it("pending requests won't rewrite cache when reinitialized", async () => {
    const [promiseEn, resolveEn] = resolvablePromise<TreeTranslationsData>();
    tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: () => promiseEn,
      },
    });
    tolgee.run();
    await Promise.resolve();
    tolgee.addPlugin(DevToolsPlugin());
    await waitForInitialLoad(tolgee);
    expect(tolgee.t('test.sub')).toEqual('en.default');
    resolveEn({ test: { sub: 'Invalid' } });
    await Promise.resolve();
    expect(tolgee.t('test.sub')).toEqual('en.default');
  });

  it('language prop overrides current language', () => {
    tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { hello: 'Hello' },
        cs: { hello: 'Ahoj' },
      },
    });

    expect(tolgee.t('hello')).toEqual('Hello');
    expect(tolgee.t('hello', { language: 'cs' })).toEqual('Ahoj');
  });
});
