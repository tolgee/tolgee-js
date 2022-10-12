import { getTranslateParams } from './TranslateParams';
import { TranslateProps } from './types';

const testParams: TranslateProps = {
  key: 'test',
  defaultValue: 'Test',
  noWrap: true,
  ns: [],
  orEmpty: true,
  params: { yo: 'yo' },
};

describe('getTranslateParams', () => {
  it('manages regular params', () => {
    const result = getTranslateParams(testParams);
    expect(result).toEqual(testParams);
  });

  it('manages key with default value', () => {
    const result = getTranslateParams('test', 'Test');
    expect(result).toEqual({ key: 'test', defaultValue: 'Test' });
  });

  it('manages key with options', () => {
    const result = getTranslateParams('test', { noWrap: true, yo: 'yo' });
    expect(result).toEqual({ key: 'test', noWrap: true, params: { yo: 'yo' } });
  });

  it('manages key default and options', () => {
    const result = getTranslateParams('test', 'Test', {
      noWrap: true,
      ns: [],
      orEmpty: true,
      yo: 'yo',
    });
    expect(result).toEqual(testParams);
  });
});
