/* eslint-disable no-console */
import { TolgeeCore } from '../TolgeeCore';
import { LanguageStorageError, TolgeePlugin } from '../types';

const failingStorage = (async: boolean): TolgeePlugin => {
  return (tolgee, tools) => {
    tools.setLanguageStorage({
      async getLanguage() {
        if (async) {
          return Promise.reject(new Error('failed to fetch'));
        } else {
          throw new Error('failed to fetch');
        }
      },
      async setLanguage() {
        if (async) {
          return Promise.reject(new Error('failed to fetch'));
        } else {
          throw new Error('failed to fetch');
        }
      },
    });
    return tolgee;
  };
};

describe('language storage errors', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('emitts error when language is loaded async', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingStorage(true))
      .init({ availableLanguages: ['en', 'cs'], defaultLanguage: 'en' });
    tolgee.on('error', errorHandler);
    await expect(() => tolgee.run()).rejects.toThrow(LanguageStorageError);
    const firstArgument = errorHandler.mock.calls[0][0]
      .value as LanguageStorageError;

    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to load language'
    );
    expect(firstArgument).toBeInstanceOf(Error);
    expect(firstArgument).toBeInstanceOf(LanguageStorageError);
    expect(firstArgument).toHaveProperty('name', 'LanguageStorageError');
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });

  it('emitts error when language is loaded sync', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingStorage(false))
      .init({ availableLanguages: ['en', 'cs'], defaultLanguage: 'en' });
    tolgee.on('error', errorHandler);
    await expect(() => tolgee.run()).rejects.toThrow(LanguageStorageError);
    const firstArgument = errorHandler.mock.calls[0][0]
      .value as LanguageStorageError;

    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to load language'
    );
    expect(firstArgument).toBeInstanceOf(LanguageStorageError);
    expect(firstArgument).toHaveProperty('name', 'LanguageStorageError');
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });

  it('emitts error when language is saved async', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingStorage(true))
      .init({ availableLanguages: ['en', 'cs'], language: 'en' });
    tolgee.on('error', errorHandler);
    await tolgee.run();
    await expect(() => tolgee.changeLanguage('cs')).rejects.toThrow(
      LanguageStorageError
    );
    const firstArgument = errorHandler.mock.calls[0][0]
      .value as LanguageStorageError;
    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to store language'
    );
    expect(firstArgument).toBeInstanceOf(LanguageStorageError);
    expect(firstArgument).toHaveProperty('name', 'LanguageStorageError');
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });

  it('emitts error when language is saved sync', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingStorage(false))
      .init({ availableLanguages: ['en', 'cs'], language: 'en' });
    tolgee.on('error', errorHandler);
    await tolgee.run();
    await expect(() => tolgee.changeLanguage('cs')).rejects.toThrow(
      LanguageStorageError
    );
    const firstArgument = errorHandler.mock.calls[0][0]
      .value as LanguageStorageError;
    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to store language'
    );
    expect(firstArgument).toBeInstanceOf(LanguageStorageError);
    expect(firstArgument).toHaveProperty('name', 'LanguageStorageError');
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });
});
