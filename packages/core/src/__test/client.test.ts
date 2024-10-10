import { TolgeeCore } from '../index';

describe('using tolgee as client', () => {
  it('fetch data without running', async () => {
    const promiseEnTest = jest.fn(() => Promise.resolve({ test: 'Test' }));
    const promiseEnCommon = jest.fn(() =>
      Promise.resolve({ cancel: 'Cancel' })
    );
    const promiseEsTest = jest.fn(() => Promise.resolve({ test: 'Testa' }));
    const promiseEsCommon = jest.fn(() =>
      Promise.resolve({ cancel: 'Cancellar' })
    );

    const tolgee = TolgeeCore().init({
      language: 'en',
      ns: ['common'],
      staticData: {
        'en:common': promiseEnCommon,
        'en:test': promiseEnTest,
        'es:common': promiseEsCommon,
        'es:test': promiseEsTest,
      },
    });

    const enTest = await tolgee.loadRecord({
      language: 'en',
      namespace: 'test',
    });
    expect(promiseEnTest).toBeCalledTimes(1);
    expect(promiseEnCommon).not.toBeCalled();
    expect(enTest).toEqual({ test: 'Test' });

    const enCommon = await tolgee.loadRecord({
      language: 'en',
      namespace: 'common',
    });
    expect(promiseEnCommon).toBeCalledTimes(1);
    expect(enCommon).toEqual({ cancel: 'Cancel' });

    const esTest = await tolgee.loadRecord({
      language: 'es',
      namespace: 'test',
    });
    expect(promiseEsTest).toBeCalledTimes(1);
    expect(promiseEsCommon).not.toBeCalled();
    expect(esTest).toEqual({ test: 'Testa' });
  });
});
