import { Tolgee } from '../index';

describe('events', () => {
  it('emits language change event', async () => {
    const tolgee = Tolgee({ language: 'en' });
    const handler = jest.fn((lang) => {});
    tolgee.on('language', handler);
    await tolgee.changeLanguage('es');
    expect(handler).toHaveBeenCalledWith({ value: 'es' });
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

    tolgee.onKeyUpdate(helloHandler).subscribeKey({ key: 'hello' });
    tolgee.onKeyUpdate(languageHandler).subscribeKey({ key: 'language' });

    tolgee.changeTranslation({ language: 'es' }, 'hello', 'Světe');
    tolgee.changeLanguage('es');

    await Promise.resolve();
    expect(helloHandler).toHaveBeenCalledTimes(1);
    expect(languageHandler).toHaveBeenCalledTimes(1);
  });
});
