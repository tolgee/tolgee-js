import { TolgeeCore, TolgeePlugin, TolgeeInstance } from '../index';

describe('language storage plugin', () => {
  let tolgee: TolgeeInstance;
  let storedValue: string | undefined;
  const StoragePlugin =
    (value: any): TolgeePlugin =>
    (tolgee, tools) => {
      tools.setLanguageStorage({
        getLanguage() {
          return value;
        },
        setLanguage(language: string) {
          storedValue = language;
        },
      });
      return tolgee;
    };

  afterEach(() => {
    tolgee.stop();
  });

  it('will restore language without loading', async () => {
    tolgee = TolgeeCore()
      .use(StoragePlugin('en'))
      .init({
        defaultLanguage: 'es',
        staticData: {
          en: { test: 'Test' },
        },
      });
    const onFetchingHandler = jest.fn(() => {});
    const onLoadingHandler = jest.fn(() => {});

    tolgee.on('fetching', onFetchingHandler);
    tolgee.on('loading', onLoadingHandler);

    tolgee.run();
    expect(tolgee.getLanguage()).toEqual('en');
    expect(tolgee.isLoading()).toBeFalsy();
    expect(tolgee.isFetching()).toBeFalsy();

    expect(onFetchingHandler).not.toBeCalled();
    expect(onLoadingHandler).not.toBeCalled();
  });

  it('will restore language async', async () => {
    tolgee = TolgeeCore()
      .use(StoragePlugin(Promise.resolve('en')))
      .init({
        defaultLanguage: 'es',
        staticData: {
          en: { test: 'Test' },
        },
      });
    const onFetchingHandler = jest.fn(() => {});
    const onLoadingHandler = jest.fn(() => {});

    tolgee.on('fetching', onFetchingHandler);
    tolgee.on('loading', onLoadingHandler);

    const runPromise = tolgee.run();
    expect(tolgee.isLoading()).toBeTruthy();
    expect(tolgee.isFetching()).toBeTruthy();

    await runPromise;
    expect(tolgee.isLoading()).toBeFalsy();
    expect(tolgee.isFetching()).toBeFalsy();
    expect(onFetchingHandler).toBeCalledTimes(2);
    expect(onLoadingHandler).toBeCalledTimes(2);
  });

  it('will fallback correctly', async () => {
    tolgee = TolgeeCore()
      .use(StoragePlugin(Promise.resolve(undefined)))
      .init({
        defaultLanguage: 'es',
        staticData: {
          en: { test: 'Test' },
        },
      });
    const runPromise = tolgee.run();
    expect(tolgee.getLanguage()).toEqual(undefined);

    await runPromise;
    expect(tolgee.getLanguage()).toEqual('es');
  });

  it('will return key before language is loaded', async () => {
    tolgee = TolgeeCore()
      .use(StoragePlugin(Promise.resolve('en')))
      .init({
        defaultLanguage: 'es',
        staticData: {
          en: { test: 'Test' },
        },
      });

    const runPromise = tolgee.run();
    expect(tolgee.t({ key: 'test' })).toEqual('test');

    await runPromise;
    expect(tolgee.t({ key: 'test' })).toEqual('Test');
  });

  it('will store language value on language change', async () => {
    tolgee = TolgeeCore()
      .use(StoragePlugin(Promise.resolve('en')))
      .init({
        defaultLanguage: 'es',
        staticData: {
          en: { test: 'Test' },
          es: { test: 'Testa' },
        },
      });

    tolgee.run();

    await tolgee.changeLanguage('es');
    expect(storedValue).toEqual('es');
  });

  it('will ignore invalid values', () => {
    tolgee = TolgeeCore()
      .use(StoragePlugin('eq'))
      .init({
        defaultLanguage: 'es',
        staticData: {
          en: { test: 'Test' },
          es: { test: 'Testa' },
        },
      });
    tolgee.run();
    expect(tolgee.getLanguage()).toEqual('es');
  });

  it('will throw an error when no available languages are specified', () => {
    tolgee = TolgeeCore().use(StoragePlugin('eq')).init({
      defaultLanguage: 'es',
    });
    expect(() => tolgee.run()).toThrowError('availableLanguages');
  });
});
