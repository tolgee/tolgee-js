import { TolgeeCore, TolgeePlugin, TolgeeInstance } from '../index';

const DetectionPlugin =
  (value: any): TolgeePlugin =>
  (tolgee, tools) => {
    tools.setLanguageDetector({
      getLanguage() {
        return value;
      },
    });
    return tolgee;
  };

describe('language detection plugin', () => {
  let tolgee: TolgeeInstance;

  afterEach(() => {
    tolgee.stop();
  });

  it('will detect language without loading', async () => {
    tolgee = TolgeeCore()
      .use(DetectionPlugin('en'))
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

  it('will detect language async', async () => {
    tolgee = TolgeeCore()
      .use(DetectionPlugin(Promise.resolve('en')))
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
      .use(DetectionPlugin(Promise.resolve(undefined)))
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
      .use(DetectionPlugin(Promise.resolve('en')))
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

  it('will throw error when no avaliableLanguages are set', () => {
    tolgee = TolgeeCore().use(DetectionPlugin('en')).init({
      defaultLanguage: 'es',
    });

    expect(() => tolgee.run()).toThrow();
  });

  it('will throw error when no defaultLanguage specified', () => {
    tolgee = TolgeeCore()
      .use(DetectionPlugin('en'))
      .init({
        staticData: {
          en: { test: 'Test' },
        },
      });

    expect(() => tolgee.run()).toThrow(/'defaultLanguage'/);
  });

  it('will throw error when no available languages specified', () => {
    tolgee = TolgeeCore().use(DetectionPlugin('en')).init({});

    expect(() => tolgee.run()).toThrow(/'availableLanguages'/);
  });
});
