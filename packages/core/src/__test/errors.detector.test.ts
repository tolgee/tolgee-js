/* eslint-disable no-console */
import { TolgeeCore } from '../TolgeeCore';
import { LanguageDetectorError, TolgeePlugin } from '../types';

const failingDetector = (async: boolean): TolgeePlugin => {
  return (tolgee, tools) => {
    tools.setLanguageDetector({
      async getLanguage() {
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

describe('language detector errors', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('emitts error when detector fails async', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingDetector(true))
      .init({ availableLanguages: ['en', 'cs'], defaultLanguage: 'en' });
    tolgee.on('error', errorHandler);
    await expect(() => tolgee.run()).rejects.toThrow(LanguageDetectorError);
    const firstArgument = errorHandler.mock.calls[0][0]
      .value as LanguageDetectorError;
    expect(firstArgument).toBeInstanceOf(LanguageDetectorError);
    expect(firstArgument).toBeInstanceOf(Error);
    expect(firstArgument).toHaveProperty('name', 'LanguageDetectorError');
    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to detect language'
    );
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });

  it('emitts error when detector fails sync', async () => {
    const errorHandler = jest.fn();
    const tolgee = TolgeeCore()
      .use(failingDetector(false))
      .init({ availableLanguages: ['en', 'cs'], defaultLanguage: 'en' });
    tolgee.on('error', errorHandler);
    await expect(() => tolgee.run()).rejects.toThrow(LanguageDetectorError);
    const firstArgument = errorHandler.mock.calls[0][0]
      .value as LanguageDetectorError;
    expect(firstArgument).toBeInstanceOf(LanguageDetectorError);
    expect(firstArgument).toHaveProperty('name', 'LanguageDetectorError');
    expect(firstArgument).toHaveProperty(
      'message',
      'Tolgee: Failed to detect language'
    );
    expect(console.warn).toBeCalledTimes(0);
    expect(console.error).toBeCalledTimes(1);
  });
});
