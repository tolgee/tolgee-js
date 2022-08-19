import { Tolgee } from './Tolgee';
import { TreeTranslationsData } from './types';

const resolvablePromise = <T = any>() => {
  let resolve: (value: T) => void;
  const promise = new Promise<T>((innerResolve) => {
    resolve = innerResolve;
  });
  return [promise, resolve!] as const;
};

describe('basis', () => {
  it('changes language', async () => {
    const tolgee = Tolgee({ language: 'en' });
    expect(tolgee.getLanguage()).toEqual('en');
    await tolgee.changeLanguage('es');
    expect(tolgee.getLanguage()).toEqual('es');
  });

  it('emits language change event', async () => {
    const tolgee = Tolgee({ language: 'en' });
    const handler = jest.fn((lang) => {});
    tolgee.onLanguageChange.listen(handler);
    await tolgee.changeLanguage('es');
    expect(handler).toHaveBeenCalledWith('es');
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

  it('returns correct translation from workspace', () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: {
        en: { hello: 'World' },
        'en:common': { test: 'Test' },
        es: { hello: 'Mundo' },
        'es:common': { test: 'Test' },
      },
    });
    expect(tolgee.instant('hello')).toEqual('World');
    expect(tolgee.instant('test')).toEqual(undefined);
    expect(tolgee.instant('test', 'common')).toEqual('Test');
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
