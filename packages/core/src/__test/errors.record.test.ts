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
});
