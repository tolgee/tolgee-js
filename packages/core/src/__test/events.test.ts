import { TolgeeCore } from '../index';

describe('events', () => {
  it('emits language change event', async () => {
    const tolgee = TolgeeCore().init({ language: 'en' });
    const handler = jest.fn((lang) => {});
    tolgee.on('language', handler);
    await tolgee.changeLanguage('es');
    expect(handler).toHaveBeenCalledWith({ type: 'language', value: 'es' });
  });

  it('emits pendingLanguage event correctly', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: () => Promise.resolve().then(() => ({ test: 'Test' })),
        es: () => Promise.resolve().then(() => ({ test: 'El Test' })),
      },
    });
    await tolgee.run();
    const languageHandler = jest.fn();
    const pendingLanguageHandler = jest.fn();
    tolgee.on('language', languageHandler);
    tolgee.on('pendingLanguage', pendingLanguageHandler);
    const promise = tolgee.changeLanguage('es');
    expect(pendingLanguageHandler).toHaveBeenCalledTimes(1);
    expect(languageHandler).toHaveBeenCalledTimes(0);
    await promise;
    expect(pendingLanguageHandler).toHaveBeenCalledTimes(1);
    expect(languageHandler).toHaveBeenCalledTimes(1);
  });

  it('groups cache events with language change event', async () => {
    const tolgee = TolgeeCore().init({ language: 'en' });
    const handler = jest.fn((e) => {});
    tolgee.on('update', handler);
    tolgee.addStaticData({ en: { test: 'Test' } });
    tolgee.changeLanguage('es');
    expect(handler).toHaveBeenCalledWith([
      { type: 'cache', value: { language: 'en', namespace: '' } },
      { type: 'language', value: 'es' },
    ]);
  });

  it('groups cache events with initialLoad event', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: () => Promise.resolve({ test: 'Test' }),
      },
    });
    const handler = jest.fn((e) => {});
    tolgee.on('update', handler);
    await tolgee.run();
    expect(handler).toHaveBeenCalledWith([
      { type: 'cache', value: { language: 'en', namespace: '' } },
      { type: 'initialLoad', value: undefined },
    ]);
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
