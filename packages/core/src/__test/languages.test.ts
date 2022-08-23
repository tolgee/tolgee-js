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
    expect(tolgee.instant('hello')).toEqual('World');
    await tolgee.changeLanguage('es');
    expect(tolgee.instant('hello')).toEqual('Mundo');
    await tolgee.changeLanguage('cs');
    expect(tolgee.instant('hello')).toBeUndefined();
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
    expect(tolgee.instant('test')).toEqual(undefined);
    const langChangeEnPromise = tolgee.changeLanguage('en');
    resolveEn({ test: 'Test' });
    await langChangeEnPromise;
    expect(tolgee.instant('test')).toEqual('Test');

    const langChangeEsPromise = tolgee.changeLanguage('es');
    resolveEs({ test: 'Testa' });
    await langChangeEsPromise;
    expect(tolgee.instant('test')).toEqual('Testa');
  });
});
