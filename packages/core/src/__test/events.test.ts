import { TolgeeCore } from '../index';

describe('events', () => {
  it('emits language change event', async () => {
    const tolgee = TolgeeCore().init({ language: 'en' });
    const handler = jest.fn((lang) => {});
    tolgee.on('language', handler);
    await tolgee.changeLanguage('es');
    expect(handler).toHaveBeenCalledWith({ value: 'es' });
  });

  it('correctly emits translation change listeners', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { hello: 'World', language: 'English' },
        es: { hello: 'Mundo', language: 'Spanish' },
      },
    });
    const helloHandler = jest.fn(() => {});
    const languageHandler = jest.fn(() => {});

    tolgee.onNsUpdate(helloHandler);
    tolgee.onNsUpdate(languageHandler);

    tolgee.changeTranslation({ language: 'es' }, 'hello', 'Světe');
    tolgee.changeLanguage('es');

    await Promise.resolve();
    expect(helloHandler).toHaveBeenCalledTimes(1);
    expect(languageHandler).toHaveBeenCalledTimes(1);
  });

  it('stop emitting when turned off', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { hello: 'World', language: 'English' },
        es: { hello: 'Mundo', language: 'Spanish' },
      },
    });
    const eventHandler = jest.fn(() => {});

    tolgee.on('language', eventHandler);
    tolgee.on('pendingLanguage', eventHandler);

    await tolgee.changeLanguage('es');
    expect(eventHandler).toBeCalledTimes(2);

    tolgee.setEmitterActive(false);
    await tolgee.changeLanguage('en');
    expect(eventHandler).toBeCalledTimes(2);

    tolgee.setEmitterActive(true);
    await tolgee.changeLanguage('es');
    expect(eventHandler).toBeCalledTimes(4);
  });
});
