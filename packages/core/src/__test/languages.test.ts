import { Tolgee, TreeTranslationsData } from '../index';
import { resolvablePromise } from './testTools';

describe('language changes', () => {
  it('changes language', async () => {
    const tolgee = Tolgee({ language: 'en' });
    expect(tolgee.getLanguage()).toEqual('en');
    await tolgee.changeLanguage('es');
    expect(tolgee.getLanguage()).toEqual('es');
  });

  it('returns correct translation', async () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'World' }, es: { hello: 'Mundo' } },
    });
    expect(tolgee.instant({ key: 'hello' })).toEqual('World');
    await tolgee.changeLanguage('es');
    expect(tolgee.instant({ key: 'hello' })).toEqual('Mundo');
    await tolgee.changeLanguage('cs');
    expect(tolgee.instant({ key: 'hello' })).toEqual('hello');
  });

  it('fetches language data correctly', async () => {
    const [promiseEn, resolveEn] = resolvablePromise<TreeTranslationsData>();
    const [promiseEs, resolveEs] = resolvablePromise<TreeTranslationsData>();
    const tolgee = Tolgee({
      language: 'en',
      staticData: {
        en: () => promiseEn,
        es: () => promiseEs,
      },
    });
    const runPromise = tolgee.run();
    expect(tolgee.instant({ key: 'test' })).toEqual('test');
    expect(tolgee.getPendingLanguage()).toEqual('en');
    resolveEn({ test: 'Test' });
    await runPromise;
    expect(tolgee.instant({ key: 'test' })).toEqual('Test');

    const langChangeEsPromise = tolgee.changeLanguage('es');
    expect(tolgee.getPendingLanguage()).toEqual('es');
    resolveEs({ test: 'Testa' });
    await langChangeEsPromise;
    expect(tolgee.instant({ key: 'test' })).toEqual('Testa');
  });

  it('fetches fallback', async () => {
    const [promiseEn, resolveEn] = resolvablePromise<TreeTranslationsData>();
    const [promiseEs, resolveEs] = resolvablePromise<TreeTranslationsData>();
    const [promiseEnGb, resolveEnGb] =
      resolvablePromise<TreeTranslationsData>();
    const [promiseEnIn, resolveEnIn] =
      resolvablePromise<TreeTranslationsData>();

    const tolgee = Tolgee({
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

    expect(tolgee.instant({ key: 'color' })).toEqual('Pintar');
    expect(tolgee.instant({ key: 'egg' })).toEqual('Egg');

    resolveEnGb({ color: 'Colour', india: 'India' });
    resolveEnIn({ india: 'Blabla' });

    await tolgee.changeLanguage('en-IN');
    expect(tolgee.instant({ key: 'color' })).toEqual('Colour');
    expect(tolgee.instant({ key: 'egg' })).toEqual('Egg');
    expect(tolgee.instant({ key: 'india' })).toEqual('Blabla');

    await tolgee.changeLanguage('en-GB');
    expect(tolgee.instant({ key: 'color' })).toEqual('Colour');
    expect(tolgee.instant({ key: 'egg' })).toEqual('Egg');
    expect(tolgee.instant({ key: 'india' })).toEqual('India');

    await tolgee.changeLanguage('en');
    expect(tolgee.instant({ key: 'color' })).toEqual('Color');
    expect(tolgee.instant({ key: 'egg' })).toEqual('Egg');
    expect(tolgee.instant({ key: 'india' })).toEqual('india');
  });
});
