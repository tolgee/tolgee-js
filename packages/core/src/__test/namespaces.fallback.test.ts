import { TolgeeCore } from '../TolgeeCore';

describe('namespaces fallback', () => {
  test('works with multiple and default', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { '0': 'noNamespace' },
        'en:first': { '1': 'first' },
        'en:second': { '2': 'second' },
      },
      fallbackNs: ['first', 'second'],
    });

    expect(tolgee.t({ key: '0' })).toEqual('noNamespace');
    expect(tolgee.t({ key: '1' })).toEqual('first');
    expect(tolgee.t({ key: '2' })).toEqual('second');
    expect(tolgee.t({ key: '4' })).toEqual('4');
    expect(tolgee.t({ key: '4', orEmpty: true })).toEqual('');
  });

  test('works when no fallback specified', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { '0': 'noNamespace' },
        'en:second': { '2': 'second' },
      },
      fallbackNs: ['first', 'second'],
    });

    expect(tolgee.t({ key: '0' })).toEqual('noNamespace');
    expect(tolgee.t({ key: '1' })).toEqual('1');
    expect(tolgee.t({ key: '2' })).toEqual('second');
    expect(tolgee.t({ key: '4' })).toEqual('4');
    expect(tolgee.t({ key: '4', orEmpty: true })).toEqual('');
  });

  test('works when data present but no fallback', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { '0': 'noNamespace' },
        'en:first': { '1': 'first' },
        'en:second': { '2': 'second' },
      },
      fallbackNs: ['second'],
    });

    expect(tolgee.t({ key: '0' })).toEqual('noNamespace');
    expect(tolgee.t({ key: '1' })).toEqual('1');
    expect(tolgee.t({ key: '2' })).toEqual('second');
    expect(tolgee.t({ key: '4' })).toEqual('4');
    expect(tolgee.t({ key: '4', orEmpty: true })).toEqual('');
  });

  test('works with default', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      staticData: {
        en: { '0': 'empty' },
        'en:first': { '1': 'first' },
        'en:second': { '2': 'second' },
      },
      fallbackNs: ['second'],
    });

    expect(tolgee.t({ key: '1' })).toEqual('1');
    expect(tolgee.t({ key: '0' })).toEqual('empty');
    expect(tolgee.t({ key: '1', ns: 'first' })).toEqual('first');
    expect(tolgee.t({ key: '0', ns: 'first' })).toEqual('0');
    expect(tolgee.t({ key: '2', ns: 'first' })).toEqual('second');
    expect(tolgee.t({ key: '2', ns: 'second' })).toEqual('second');
  });
});
