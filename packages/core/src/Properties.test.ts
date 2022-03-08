jest.dontMock('./Properties');
jest.dontMock('./TolgeeConfig');

import '@testing-library/jest-dom/extend-expect';
import { mocked } from 'ts-jest/utils';
import { TolgeeConfig } from './TolgeeConfig';
import { Properties } from './Properties';

describe('Properties', () => {
  let properties: Properties;

  beforeEach(() => {
    jest.clearAllMocks();
    properties = new Properties();
  });

  test('can be created', () => {
    expect(properties).not.toBeNull();
  });

  describe('preferred languages', () => {
    test('getter returns from local storage', () => {
      const dummyReturn = ['dummyLang1'];
      Storage.prototype.getItem = jest.fn();
      mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(dummyReturn)
      );
      expect(properties.preferredLanguages).toEqual(new Set(dummyReturn));
      expect(localStorage.getItem).toBeCalledWith(
        '__tolgee_preferredLanguages'
      );
    });

    test('setter sets local storage item', () => {
      const dummySet = ['dummyLang1'];
      Storage.prototype.setItem = jest.fn();
      properties.preferredLanguages = new Set(dummySet);
      expect(localStorage.setItem).toBeCalledWith(
        '__tolgee_preferredLanguages',
        JSON.stringify(dummySet)
      );
    });
  });

  describe('current language', () => {
    test('getter returns from local storage', () => {
      const dummyReturn = 'cs';
      properties.config = { availableLanguages: ['cs', 'en'] };
      Storage.prototype.getItem = jest.fn();
      mocked(localStorage.getItem).mockReturnValueOnce(dummyReturn);
      expect(properties.currentLanguage).toEqual(dummyReturn);
      expect(localStorage.getItem).toBeCalledWith('__tolgee_currentLanguage');
    });

    test('setter sets local storage item', () => {
      const dummySet = 'dummyLang1';
      Storage.prototype.setItem = jest.fn();
      properties.currentLanguage = dummySet;
      expect(localStorage.setItem).toBeCalledWith(
        '__tolgee_currentLanguage',
        dummySet
      );
    });

    test('returns correct lang by navigator', () => {
      const languageGetter = jest.spyOn(window.navigator, 'language', 'get');
      languageGetter.mockReturnValue('cs');
      properties.config = { availableLanguages: ['en', 'cs'] };
      expect(properties.currentLanguage).toEqual('cs');
    });

    test('available languages derrived from staticData', () => {
      const languageGetter = jest.spyOn(window.navigator, 'language', 'get');
      languageGetter.mockReturnValue('cs');
      properties.config = new TolgeeConfig({ staticData: { en: {}, cs: {} } });
      expect(properties.currentLanguage).toEqual('cs');
    });

    test('returns default lang if not available', () => {
      const languageGetter = jest.spyOn(window.navigator, 'language', 'get');
      languageGetter.mockReturnValue('cs');
      properties.config = { availableLanguages: ['en'], defaultLanguage: 'en' };
      expect(properties.currentLanguage).toEqual('en');
    });

    test('returns correct language ignoring dialect', () => {
      const languageGetter = jest.spyOn(window.navigator, 'language', 'get');
      languageGetter.mockReturnValue('en-GB');
      properties.config = {
        availableLanguages: ['en-US'],
        defaultLanguage: 'en-US',
      };
      expect(properties.currentLanguage).toEqual('en-US');
    });    

    test('returns correct parent language ignoring dialect', () => {
      const dummyReturn = 'en-US';
      Storage.prototype.getItem = jest.fn();
      mocked(localStorage.getItem).mockReturnValueOnce(dummyReturn);
      properties.config = {
        availableLanguages: ['en']
      };
      expect(properties.currentLanguage).toEqual('en');
    });  

    test('returns correct parent language ignoring dialect and fallback', () => {
      const dummyReturn = 'en-US';
      Storage.prototype.getItem = jest.fn();
      mocked(localStorage.getItem).mockReturnValueOnce(dummyReturn);
      properties.config = {
        availableLanguages: ['en'],
        fallbackLanguage: 'de'
      };
      expect(properties.currentLanguage).toEqual('en');
    });

    test('returns correct fallback language ignoring non-available dialect and parent', () => {
      const dummyReturn = 'en-US';
      Storage.prototype.getItem = jest.fn();
      mocked(localStorage.getItem).mockReturnValueOnce(dummyReturn);
      properties.config = {
        availableLanguages: ['de','it'],
        fallbackLanguage: 'it'
      };
      expect(properties.currentLanguage).toEqual('it');
    });

    test('resets current language when missing in availableLanguages', () => {
      const dummyReturn = 'cs';
      Storage.prototype.getItem = jest.fn();
      mocked(localStorage.getItem).mockReturnValueOnce(dummyReturn);
      properties.config = {
        availableLanguages: ['en', 'de'],
        defaultLanguage: 'en',
      };
      expect(properties.currentLanguage).toEqual('en');
    });
  });
});
