/* eslint-disable no-console */
import { TolgeeCore } from '../TolgeeCore';
import { RecordFetchError, TolgeePlugin } from '../types';

const failingBackend = (): TolgeePlugin => {
  return (tolgee, tools) => {
    tools.addBackend({
      async getRecord() {
        return Promise.reject(new Error('failed to fetch'));
      },
    });
    return tolgee;
  };
};

const failingDevBackend = (): TolgeePlugin => {
  return (tolgee, tools) => {
    tools.setDevBackend({
      async getRecord() {
        return Promise.reject(new Error('failed to fetch'));
      },
    });
    return tolgee;
  };
};

describe('translation records', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('emitts error when fails to fetch dev record', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingDevBackend())
      .init({ language: 'en', apiKey: 'test', apiUrl: 'test' });
    tolgee.on('error', errorHandler);
    await tolgee.run();
    const firstArgument = errorHandler.mock.calls[0][0]
      .value as RecordFetchError;
    expect(firstArgument).toBeInstanceOf(RecordFetchError);
    expect(firstArgument).toBeInstanceOf(Error);
    expect(firstArgument).toHaveProperty('language', 'en');
    expect(firstArgument).toHaveProperty('namespace', '');
    expect(firstArgument).toHaveProperty('isDev', true);
    expect(firstArgument).toHaveProperty('name', 'RecordFetchError');
    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to fetch record for "en"'
    );
    expect(console.warn).toBeCalledTimes(1);
    expect(console.error).toBeCalledTimes(0);
  });

  it('emitts error when fails to fetch record', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore().use(failingBackend()).init({ language: 'en' });
    tolgee.on('error', errorHandler);
    await expect(() => tolgee.run()).rejects.toThrow(RecordFetchError);
    const firstArgument = errorHandler.mock.calls[0][0]
      .value as RecordFetchError;
    expect(firstArgument).toBeInstanceOf(RecordFetchError);
    expect(firstArgument).toHaveProperty('language', 'en');
    expect(firstArgument).toHaveProperty('namespace', '');
    expect(firstArgument).toHaveProperty('isDev', false);
    expect(firstArgument).toHaveProperty('name', 'RecordFetchError');
    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to fetch record for "en"'
    );
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });

  it('emitts error when fails to fetch promise in static data', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingDevBackend())
      .init({
        language: 'en',
        staticData: { en: () => Promise.reject(new Error('No data')) },
      });
    tolgee.on('error', errorHandler);
    await expect(() => tolgee.run()).rejects.toThrow(RecordFetchError);

    const firstArgument = errorHandler.mock.calls[0][0]
      .value as RecordFetchError;
    expect(firstArgument).toBeInstanceOf(RecordFetchError);
    expect(firstArgument).toHaveProperty('language', 'en');
    expect(firstArgument).toHaveProperty('namespace', '');
    expect(firstArgument).toHaveProperty('isDev', false);
    expect(firstArgument).toHaveProperty('name', 'RecordFetchError');
    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to fetch record for "en"'
    );
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });

  it('emitts error when it fails', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingDevBackend())
      .init({
        language: 'en',
        staticData: { en: () => Promise.reject(new Error('No data')) },
      });
    tolgee.on('error', errorHandler);
    await expect(() => tolgee.run()).rejects.toThrow(RecordFetchError);

    const firstArgument = errorHandler.mock.calls[0][0]
      .value as RecordFetchError;
    expect(firstArgument).toBeInstanceOf(RecordFetchError);
    expect(firstArgument).toHaveProperty('language', 'en');
    expect(firstArgument).toHaveProperty('namespace', '');
    expect(firstArgument).toHaveProperty('isDev', false);
    expect(firstArgument).toHaveProperty('name', 'RecordFetchError');
    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to fetch record for "en"'
    );
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });
  it('recovers a language after a transient static-data failure', async () => {
    const loader = jest
      .fn()
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValue({ greeting: 'Hallo' });
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: { en: { greeting: 'Hello' }, de: loader },
    });
    const fetching = jest.fn();
    tolgee.on('fetching', fetching);
    await tolgee.run();
    await expect(tolgee.changeLanguage('de')).rejects.toThrow(RecordFetchError);
    expect(tolgee.getLanguage()).toBe('en');
    expect(tolgee.t('greeting')).toBe('Hello');
    expect(tolgee.isFetching()).toBe(false);
    await tolgee.changeLanguage('de');
    expect(loader).toBeCalledTimes(2);
    expect(tolgee.getLanguage()).toBe('de');
    expect(tolgee.t('greeting')).toBe('Hallo');
    expect(tolgee.isFetching()).toBe(false);
    expect(fetching.mock.calls.map(([event]) => event.value)).toEqual([
      true,
      false,
      true,
      false,
    ]);
  });

  it('finishes loading after a failed initial load and can restart', async () => {
    const loader = jest
      .fn()
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValue({ greeting: 'Hallo' });
    const tolgee = TolgeeCore().init({
      language: 'de',
      staticData: { de: loader },
    });
    const initialLoaded = jest.fn();
    tolgee.on('initialLoad', initialLoaded);
    await expect(tolgee.run()).rejects.toThrow(RecordFetchError);
    expect(tolgee.isInitialLoading()).toBe(false);
    expect(tolgee.isFetching()).toBe(false);
    expect(initialLoaded).not.toBeCalled();
    tolgee.stop();
    await tolgee.run();
    expect(loader).toBeCalledTimes(2);
    expect(tolgee.t('greeting')).toBe('Hallo');
    expect(tolgee.isInitialLoading()).toBe(false);
    expect(tolgee.isFetching()).toBe(false);
    expect(initialLoaded).toBeCalledTimes(1);
  });
  it.each(['resolve', 'reject'] as const)(
    'keeps fetching listener errors observable when a loader %s',
    async (settlement) => {
      const observerError = new Error('observer settlement failure');
      const loader = jest.fn();
      if (settlement === 'reject') {
        loader.mockRejectedValueOnce(new Error('temporary failure'));
      } else {
        loader.mockResolvedValueOnce({ greeting: 'Hallo' });
      }
      loader.mockResolvedValue({ greeting: 'Hallo' });
      const tolgee = TolgeeCore().init({
        language: 'en',
        staticData: { en: { greeting: 'Hello' }, de: loader },
      });
      await tolgee.run();
      const listener = tolgee.on('fetching', ({ value }) => {
        if (!value) {
          throw observerError;
        }
      });
      await expect(tolgee.changeLanguage('de')).rejects.toBe(observerError);
      await new Promise((resolve) => setTimeout(resolve, 0));
      listener.unsubscribe();
      expect(tolgee.isFetching()).toBe(false);
      await tolgee.changeLanguage('de');
      expect(tolgee.t('greeting')).toBe('Hallo');
    }
  );
});
