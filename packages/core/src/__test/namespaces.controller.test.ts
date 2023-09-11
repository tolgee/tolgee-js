import { Controller } from '../Controller/Controller';

describe('namespace internal function in controller', () => {
  it('it works with no default ns defined', () => {
    const controller = Controller({
      options: {
        language: 'en',
        staticData: {
          en: { test: 'emptyNs' },
          'en:common': { test: 'commonNs' },
        },
      },
    });
    expect(controller.getRequiredNamespaces()).toEqual(['']);
    expect(controller.getTranslationNs({ key: 'test' })).toEqual(['']);
    expect(controller.t({ key: 'test' })).toEqual('emptyNs');
  });

  it('default ns can be overriten with empty string', () => {
    const controller = Controller({
      options: {
        language: 'en',
        staticData: {
          en: { test: 'emptyNs' },
          'en:common': { test: 'commonNs' },
        },
        defaultNs: 'common',
      },
    });
    expect(controller.getRequiredNamespaces()).toEqual(['common']);
    expect(controller.getTranslationNs({ key: 'test' })).toEqual(['common']);
    expect(controller.t({ key: 'test' })).toEqual('commonNs');

    expect(controller.getTranslationNs({ key: 'test', ns: '' })).toEqual(['']);
    expect(controller.t({ key: 'test', ns: '' })).toEqual('emptyNs');
  });

  it("can be overriten when key doesn't exist", () => {
    const controller = Controller({
      options: {
        language: 'en',
        staticData: {
          en: { test: 'emptyNs' },
          'en:common': { test: 'commonNs' },
        },
        defaultNs: 'common',
      },
    });
    expect(controller.getRequiredNamespaces()).toEqual(['common']);
    expect(controller.getTranslationNs({ key: 'unknown' })).toEqual(['common']);
    expect(controller.t({ key: 'unknown' })).toEqual('unknown');

    expect(controller.getTranslationNs({ key: 'unknown', ns: '' })).toEqual([
      '',
    ]);
    expect(controller.t({ key: 'unknown', ns: '' })).toEqual('unknown');
  });

  it('returns correct namespaces if there are fallbacks', () => {
    const controller = Controller({
      options: {
        language: 'en',
        staticData: {
          en: { test: 'emptyNs' },
          'en:common': { test: 'commonNs' },
          'en:fallback': { test: 'fallbackNs' },
        },
        defaultNs: 'common',
        fallbackNs: ['', 'fallback'],
      },
    });
    expect(controller.getRequiredNamespaces()).toEqual([
      'common',
      '',
      'fallback',
    ]);
    expect(controller.getTranslationNs({ key: 'unknown' })).toEqual([
      'common',
      '',
      'fallback',
    ]);
    expect(controller.t({ key: 'unknown' })).toEqual('unknown');

    expect(
      controller.getTranslationNs({ key: 'unknown', ns: 'fallback' })
    ).toEqual(['fallback', '']);
    expect(controller.t({ key: 'unknown', ns: '' })).toEqual('unknown');
  });

  it('returns correct namespaces if there are empty translations', () => {
    const controller = Controller({
      options: {
        language: 'en',
        staticData: {
          en: { test: 'hello' },
          'en:translation': { test: null },
        },
        ns: ['', 'translation'],
        defaultNs: 'translation',
        fallbackNs: '',
      },
    });
    expect(controller.getDefaultAndFallbackNs()).toEqual(['translation', '']);
    expect(controller.getTranslationNs({ key: 'test' })).toEqual(['']);
    expect(controller.t({ key: 'test' })).toEqual('hello');

    expect(controller.getTranslationNs({ key: 'unknown' })).toEqual([
      'translation',
      '',
    ]);
    expect(controller.t({ key: 'unknown' })).toEqual('unknown');
  });
});
