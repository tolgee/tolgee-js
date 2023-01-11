import { createLanguageDetector } from './LanguageDetector';

describe('language detector', () => {
  beforeEach(() => {
    const languageGetter = jest.spyOn(window.navigator, 'language', 'get');
    languageGetter.mockReturnValue('cs-CZ');
  });

  it('detects language', () => {
    const detector = createLanguageDetector();

    const result = detector.getLanguage({
      availableLanguages: ['cs', 'sk'],
    });

    expect(result).toEqual('cs');
  });
});
