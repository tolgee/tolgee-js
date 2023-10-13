/* eslint-disable no-console */
import { FormatSimple } from '../FormatSimple/FormatSimple';
import { TolgeeCore } from '../TolgeeCore';

describe('missing translation', () => {
  it('returns key by default', () => {
    const tolgee = TolgeeCore().use(FormatSimple()).init({ language: 'en' });

    expect(tolgee.t('test')).toEqual('test');
  });

  it('returns default value if present', () => {
    const tolgee = TolgeeCore().use(FormatSimple()).init({ language: 'en' });

    expect(tolgee.t('tjest', 'Default value')).toEqual('Default value');
  });

  it('returns empty string if orEmpty', () => {
    const tolgee = TolgeeCore().use(FormatSimple()).init({ language: 'en' });

    expect(tolgee.t('test', { orEmpty: true })).toEqual('');
  });

  it('default value overrides orEmpty', () => {
    const tolgee = TolgeeCore().use(FormatSimple()).init({ language: 'en' });

    expect(tolgee.t('test', 'Default value', { orEmpty: true })).toEqual(
      'Default value'
    );
  });

  it('onTranslationMissing output is used', () => {
    const onTranslationMissing = jest.fn(() => 'missing');
    const tolgee = TolgeeCore().init({ language: 'en', onTranslationMissing });

    expect(tolgee.t('test')).toEqual('missing');
    expect(onTranslationMissing).toBeCalledTimes(1);
  });

  it('onTranslationMissing is called when defaultValue, output not used', () => {
    const onTranslationMissing = jest.fn(() => 'missing');
    const tolgee = TolgeeCore().init({ language: 'en', onTranslationMissing });

    expect(tolgee.t('test', 'Default value')).toEqual('Default value');
    expect(onTranslationMissing).toBeCalledTimes(1);
  });

  it('onTranslationMissing is called when orEmpty, output not used', () => {
    const onTranslationMissing = jest.fn(() => 'missing');
    const tolgee = TolgeeCore().init({ language: 'en', onTranslationMissing });

    expect(tolgee.t('test', { orEmpty: true })).toEqual('');
    expect(onTranslationMissing).toBeCalledTimes(1);
  });

  it('onTranslationMissing not called when translation exists', () => {
    const onTranslationMissing = jest.fn(() => 'missing');
    const tolgee = TolgeeCore().init({
      language: 'en',
      onTranslationMissing,
      staticData: { en: { test: 'Exists' } },
    });

    expect(tolgee.t('test')).toEqual('Exists');
    expect(onTranslationMissing).toBeCalledTimes(0);
  });

  it('onTranslationMissing not called when translation is empty string', () => {
    const onTranslationMissing = jest.fn(() => 'missing');
    const tolgee = TolgeeCore().init({
      language: 'en',
      onTranslationMissing,
      staticData: { en: { test: '' } },
    });

    expect(tolgee.t('test')).toEqual('');
    expect(onTranslationMissing).toBeCalledTimes(0);
  });
});
