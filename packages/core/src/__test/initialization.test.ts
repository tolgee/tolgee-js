import { TolgeeCore } from '../index';

describe('initialization behavior', () => {
  it("change in state before running won't trigger fetch", async () => {
    const promiseEnTest = jest.fn(() => Promise.resolve({ test: 'Test' }));
    const promiseEnCommon = jest.fn(() =>
      Promise.resolve({ cancel: 'Cancel' })
    );
    const promiseEsTest = jest.fn(() => Promise.resolve({ test: 'Testa' }));
    const promiseEsCommon = jest.fn(() =>
      Promise.resolve({ cancel: 'Cancellar' })
    );

    const tolgee = TolgeeCore().init({
      language: 'en',
      ns: ['common'],
      staticData: {
        'en:common': promiseEnCommon,
        'en:test': promiseEnTest,
        'es:common': promiseEsCommon,
        'es:test': promiseEsTest,
      },
    });
    const onInitialLoad = jest.fn();
    const onRunningChange = jest.fn();
    tolgee.on('initialLoad', onInitialLoad);
    tolgee.on('running', onRunningChange);

    await tolgee.changeLanguage('es');
    await tolgee.addActiveNs('test');
    expect(promiseEsCommon).not.toBeCalled();
    expect(promiseEnCommon).not.toBeCalled();
    expect(promiseEsTest).not.toBeCalled();
    expect(promiseEnTest).not.toBeCalled();
    expect(tolgee.isLoaded()).toBeFalsy();

    await tolgee.run();
    expect(promiseEsCommon).toBeCalled();
    expect(promiseEnCommon).not.toBeCalled();
    expect(promiseEsTest).toBeCalled();
    expect(promiseEnTest).not.toBeCalled();
    expect(tolgee.isLoaded()).toBeTruthy();

    tolgee.stop();

    expect(onInitialLoad).toBeCalledTimes(1);
    expect(onRunningChange).toBeCalledTimes(2);
  });

  it("won't start loading when nothing to load", async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { test: 'Test' },
      },
    });
    const onFetchingHandler = jest.fn(() => {});
    const onLoadingHandler = jest.fn(() => {});

    tolgee.on('fetching', onFetchingHandler);
    tolgee.on('loading', onLoadingHandler);

    const runPromise = tolgee.run();
    expect(tolgee.isLoading()).toBeFalsy();
    expect(tolgee.isFetching()).toBeFalsy();

    await runPromise;
    expect(tolgee.isLoading()).toBeFalsy();
    expect(tolgee.isFetching()).toBeFalsy();
    expect(onFetchingHandler).not.toBeCalled();
    expect(onLoadingHandler).not.toBeCalled();
  });

  it('emits keyUpdate on initialLoad', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    const onKeyChange = jest.fn();
    tolgee.on('update', onKeyChange);
    expect(onKeyChange).toBeCalledTimes(0);
    await tolgee.run();
    expect(onKeyChange).toBeCalledTimes(1);
  });
});
