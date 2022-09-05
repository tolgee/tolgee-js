import { Tolgee } from '../index';

describe('events', () => {
  it('emits language change event', async () => {
    const tolgee = Tolgee({ language: 'en' });
    const handler = jest.fn((lang) => {});
    tolgee.on('language', handler);
    await tolgee.changeLanguage('es');
    expect(handler).toHaveBeenCalledWith('es');
  });

  it('correctly emits translation change listeners', async () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: {
        en: { hello: 'World', language: 'English' },
        es: { hello: 'Mundo', language: 'Spanish' },
      },
    });
    const helloHandler = jest.fn((data) => {});
    const languageHandler = jest.fn((data) => {});

    tolgee.on('keyUpdate', helloHandler).subscribeToKey('hello');
    tolgee.on('keyUpdate', languageHandler).subscribeToKey('language');

    tolgee.changeTranslation({ language: 'es' }, 'hello', 'Světe');
    await tolgee.changeLanguage('es');
    expect(helloHandler).toHaveBeenCalledTimes(2);
    expect(languageHandler).toHaveBeenCalledTimes(1);
  });
});
