import { TolgeeCore, TreeTranslationsData } from '../index';
import { resolvablePromise } from './testTools';

describe('language changes', () => {
  it('changes language', async () => {
    const tolgee = TolgeeCore().init({ language: 'en' });
    expect(tolgee.getLanguage()).toEqual('en');
    await tolgee.changeLanguage('es');
    expect(tolgee.getLanguage()).toEqual('es');
  });

  it('returns correct translation', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: { en: { hello: 'World' }, es: { hello: 'Mundo' } },
    });
    expect(tolgee.t({ key: 'hello' })).toEqual('World');
    await tolgee.changeLanguage('es');
    expect(tolgee.t({ key: 'hello' })).toEqual('Mundo');
    await tolgee.changeLanguage('cs');
    expect(tolgee.t({ key: 'hello' })).toEqual('hello');
  });

  it('fetches language data correctly', async () => {
    const [promiseEn, resolveEn] = resolvablePromise<TreeTranslationsData>();
    const [promiseEs, resolveEs] = resolvablePromise<TreeTranslationsData>();
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: () => promiseEn,
        es: () => promiseEs,
      },
    });
    const runPromise = tolgee.run();
    expect(tolgee.t({ key: 'test' })).toEqual('test');
    expect(tolgee.getPendingLanguage()).toEqual('en');
    resolveEn({ test: 'Test' });
    await runPromise;
    expect(tolgee.t({ key: 'test' })).toEqual('Test');

    const langChangeEsPromise = tolgee.changeLanguage('es');
    expect(tolgee.getPendingLanguage()).toEqual('es');
    resolveEs({ test: 'Testa' });
    await langChangeEsPromise;
    expect(tolgee.t({ key: 'test' })).toEqual('Testa');
  });

  it('fetches fallback', async () => {
    const [promiseEn, resolveEn] = resolvablePromise<TreeTranslationsData>();
    const [promiseEs, resolveEs] = resolvablePromise<TreeTranslationsData>();
    const [promiseEnGb, resolveEnGb] =
      resolvablePromise<TreeTranslationsData>();
    const [promiseEnIn, resolveEnIn] =
      resolvablePromise<TreeTranslationsData>();

    const tolgee = TolgeeCore().init({
      language: 'es',
      staticData: {
        en: () => promiseEn,
        es: () => promiseEs,
        'en-GB': () => promiseEnGb,
        'en-IN': () => promiseEnIn,
      },
      fallbackLanguage: {
        es: 'en',
        'en-GB': 'en',
        'en-IN': ['en-GB', 'en'],
      },
    });

    resolveEn({ color: 'Color', egg: 'Egg' });
    resolveEs({ color: 'Pintar' });
    await tolgee.run();

    expect(tolgee.t({ key: 'color' })).toEqual('Pintar');
    expect(tolgee.t({ key: 'egg' })).toEqual('Egg');

    resolveEnGb({ color: 'Colour', india: 'India' });
    resolveEnIn({ india: 'Blabla' });

    await tolgee.changeLanguage('en-IN');
    expect(tolgee.t({ key: 'color' })).toEqual('Colour');
    expect(tolgee.t({ key: 'egg' })).toEqual('Egg');
    expect(tolgee.t({ key: 'india' })).toEqual('Blabla');

    await tolgee.changeLanguage('en-GB');
    expect(tolgee.t({ key: 'color' })).toEqual('Colour');
    expect(tolgee.t({ key: 'egg' })).toEqual('Egg');
    expect(tolgee.t({ key: 'india' })).toEqual('India');

    await tolgee.changeLanguage('en');
    expect(tolgee.t({ key: 'color' })).toEqual('Color');
    expect(tolgee.t({ key: 'egg' })).toEqual('Egg');
    expect(tolgee.t({ key: 'india' })).toEqual('india');
  });

  it('will fallback to default value', () => {
    const tolgee = TolgeeCore().init({
      defaultLanguage: 'en',
    });

    expect(tolgee.getLanguage()).toEqual(undefined);
    tolgee.run();
    expect(tolgee.getLanguage()).toEqual('en');
  });

  it('will throw error when no language specified', () => {
    const tolgee = TolgeeCore().init({});

    expect(() => tolgee.run()).toThrow(/'language'/);
  });

  it('loads fallback languages and namespaces', async () => {
    const loadNs = jest.fn(() => Promise.resolve(undefined as any));
    const tolgee = TolgeeCore().init({
      language: 'en',
      fallbackNs: ['fallback'],
      staticData: {
        en: loadNs,
        'en:fallback': loadNs,
        cs: loadNs,
        'cs:fallback': loadNs,
      },
    });
    await tolgee.run();
    expect(loadNs).toBeCalledTimes(2);
    await tolgee.changeLanguage('cs');
    expect(loadNs).toBeCalledTimes(4);
  });
});
