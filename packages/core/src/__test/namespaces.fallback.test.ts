import { Tolgee } from '../Tolgee';

describe('namespaces fallback', () => {
  test('works with multiple and default', () => {
    const tolgee = Tolgee({
      staticData: {
        en: { '0': 'noNamespace' },
        'en:first': { '1': 'first' },
        'en:second': { '2': 'second' },
      },
      fallbackNs: ['first', 'second'],
    });

    expect(tolgee.instant({ key: '0' })).toEqual('noNamespace');
    expect(tolgee.instant({ key: '1' })).toEqual('first');
    expect(tolgee.instant({ key: '2' })).toEqual('second');
    expect(tolgee.instant({ key: '4' })).toEqual('4');
    expect(tolgee.instant({ key: '4', orEmpty: true })).toEqual('');
  });

  test('works when no fallback specified', () => {
    const tolgee = Tolgee({
      staticData: {
        en: { '0': 'noNamespace' },
        'en:second': { '2': 'second' },
      },
      fallbackNs: ['first', 'second'],
    });

    expect(tolgee.instant({ key: '0' })).toEqual('noNamespace');
    expect(tolgee.instant({ key: '1' })).toEqual('1');
    expect(tolgee.instant({ key: '2' })).toEqual('second');
    expect(tolgee.instant({ key: '4' })).toEqual('4');
    expect(tolgee.instant({ key: '4', orEmpty: true })).toEqual('');
  });

  test('works when data present but no fallback', () => {
    const tolgee = Tolgee({
      staticData: {
        en: { '0': 'noNamespace' },
        'en:first': { '1': 'first' },
        'en:second': { '2': 'second' },
      },
      fallbackNs: ['second'],
    });

    expect(tolgee.instant({ key: '0' })).toEqual('noNamespace');
    expect(tolgee.instant({ key: '1' })).toEqual('1');
    expect(tolgee.instant({ key: '2' })).toEqual('second');
    expect(tolgee.instant({ key: '4' })).toEqual('4');
    expect(tolgee.instant({ key: '4', orEmpty: true })).toEqual('');
  });

  test('works with override', () => {
    const tolgee = Tolgee({
      staticData: {
        en: { '0': 'noNamespace' },
        'en:first': { '1': 'first' },
        'en:second': { '2': 'second' },
      },
      fallbackNs: ['second'],
    });

    expect(tolgee.instant({ key: '1' })).toEqual('1');
    expect(tolgee.instant({ key: '1', ns: 'first' })).toEqual('first');
    expect(tolgee.instant({ key: '0', ns: 'first' })).toEqual('0');
    expect(tolgee.instant({ key: '2', ns: ['first', 'second'] })).toEqual(
      'second'
    );
  });
});
