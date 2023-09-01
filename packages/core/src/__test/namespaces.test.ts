import { TolgeeCore } from '../index';

const tolgeeWithNamespaces = () => {
  const promiseEnTest = jest.fn(() => Promise.resolve({ test: 'Test' }));
  const promiseEnCommon = jest.fn(() => Promise.resolve({ cancel: 'Cancel' }));
  const promiseEsTest = jest.fn(() => Promise.resolve({ test: 'Testa' }));
  const promiseEsCommon = jest.fn(() =>
    Promise.resolve({ cancel: 'Cancellar' })
  );

  return TolgeeCore().init({
    language: 'en',
    ns: ['common'],
    defaultNs: 'common',
    staticData: {
      'en:common': promiseEnCommon,
      'en:test': promiseEnTest,
      'es:common': promiseEsCommon,
      'es:test': promiseEsTest,
    },
  });
};

describe('language changes', () => {
  it('returns correct translation from namespace', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { hello: 'World' },
        'en:common': { test: 'Test' },
      },
    });
    expect(tolgee.t({ key: 'hello' })).toEqual('World');
    expect(tolgee.t({ key: 'test' })).toEqual('test');
    expect(tolgee.t({ key: 'test', ns: 'common' })).toEqual('Test');
  });

  it('uses defaultNs', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      defaultNs: 'common',
      staticData: {
        'en:common': { test: 'Test' },
        'es:common': { test: 'Testa' },
      },
    });
    await tolgee.run();

    expect(tolgee.t({ key: 'test' })).toEqual('Test');
    await tolgee.changeLanguage('es');
    expect(tolgee.t({ key: 'test' })).toEqual('Testa');
  });

  it('active namespaces', async () => {
    const tolgee = tolgeeWithNamespaces();
    await tolgee.run();

    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('test');

    await tolgee.changeLanguage('es');

    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancellar');
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('test');

    await tolgee.changeLanguage('en');
    await tolgee.addActiveNs('test');

    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('Test');

    await tolgee.changeLanguage('es');

    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancellar');
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('Testa');
  });

  it('removing active namespaces', async () => {
    const tolgee = tolgeeWithNamespaces();
    const handler = jest.fn();
    tolgee.on('cache', handler);
    await tolgee.run();

    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('test');

    await tolgee.addActiveNs('test');
    expect(handler).toBeCalledTimes(2);

    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancel');
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('Test');

    tolgee.removeActiveNs('test');
    await tolgee.changeLanguage('es');
    expect(handler).toBeCalledTimes(3);

    expect(tolgee.t({ key: 'cancel', ns: 'common' })).toEqual('Cancellar');
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('test');
  });

  it('add active namespace with forget', async () => {
    const tolgee = tolgeeWithNamespaces();
    const handler = jest.fn();
    tolgee.on('cache', handler);
    await tolgee.run();

    // test ns is not loaded
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('test');

    await tolgee.addActiveNs('test', true);
    expect(handler).toBeCalledTimes(2);

    // test ns is loaded
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('Test');

    await tolgee.changeLanguage('es');
    expect(handler).toBeCalledTimes(3);

    // test ns is not loaded for spanish
    expect(tolgee.t({ key: 'test', ns: 'test' })).toEqual('test');
  });

  it('default ns can be overriten with empty string', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { test: 'emptyNs' },
        'en:common': { test: 'commonNs' },
      },
      defaultNs: 'emptyNs',
    });
    expect(tolgee.t({ key: 'test', ns: '' })).toEqual('emptyNs');
  });
});
