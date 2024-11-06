import { createLanguageDetector, detectLanguage } from './LanguageDetector';

describe('language detector plugin', () => {
  beforeEach(() => {
    const languageGetter = jest.spyOn(window.navigator, 'language', 'get');
    languageGetter.mockReturnValue('cs-CZ');
  });

  it('detects language from window.navigator', () => {
    const detector = createLanguageDetector();

    const result = detector.getLanguage({
      availableLanguages: ['cs', 'sk'],
      fetch: (input, init) => fetch(input, init),
    });

    expect(result).toEqual('cs');
  });
});

describe('detect language from parameters', () => {
  it('detects language exact', () => {
    expect(detectLanguage('cs', ['en', 'cs'])).toEqual('cs');
  });

  it('detects language prefix', () => {
    expect(detectLanguage('cs-CZ', ['en', 'cs'])).toEqual('cs');
  });
});
