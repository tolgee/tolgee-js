import { TolgeeCore, TreeTranslationsData } from '../index';
import { resolvablePromise } from './testTools';

describe('loading', () => {
  it('isLoading & isFetching', async () => {
    const [promiseEn, resolveEn] = resolvablePromise<TreeTranslationsData>();
    const [promiseEs, resolveEs] = resolvablePromise<TreeTranslationsData>();
    const onLoadHandler = jest.fn(() => {});
    const onFetchingHandler = jest.fn(() => {});
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: () => promiseEn,
        es: () => promiseEs,
      },
    });
    tolgee.on('initialLoad', onLoadHandler);
    tolgee.on('fetching', onFetchingHandler);

    const runPromise = tolgee.run();
    expect(tolgee.isLoading()).toBeTruthy();
    expect(tolgee.isFetching()).toBeTruthy();
    resolveEn({});
    await runPromise;
    expect(tolgee.isLoading()).toBeFalsy();
    expect(tolgee.isFetching()).toBeFalsy();
    expect(onLoadHandler).toBeCalledTimes(1);
    expect(onFetchingHandler).toBeCalledTimes(2);

    const changeLanguagePromise = tolgee.changeLanguage('es');
    expect(tolgee.isLoading()).toBeFalsy();
    expect(tolgee.isFetching()).toBeTruthy();
    resolveEs({});
    await changeLanguagePromise;
    expect(onLoadHandler).toBeCalledTimes(1);
    expect(onFetchingHandler).toBeCalledTimes(4);
    expect(tolgee.isFetching()).toBeFalsy();
  });
});
