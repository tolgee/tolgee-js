jest.autoMockOff();
import { LanguageDetector } from './LanguageDetector';

describe('icu formatter', () => {
  beforeEach(() => {
    const languageGetter = jest.spyOn(window.navigator, 'language', 'get');
    languageGetter.mockReturnValue('cs-CZ');
  });

  it('detects language', () => {
    const detector = LanguageDetector();

    const result = detector.getLanguage({
      availableLanguages: ['cs', 'sk'],
    });

    expect(result).toEqual('cs');
  });
});
