import { getTranslateProps } from './TranslateParams';
import { TranslateProps } from './types';

const testParams: TranslateProps = {
  key: 'test',
  defaultValue: 'Test',
  noWrap: true,
  ns: 'test',
  orEmpty: true,
  params: { yo: 'yo' },
};

describe('getTranslateProps', () => {
  it('manages regular params', () => {
    const result = getTranslateProps(testParams);
    expect(result).toEqual(testParams);
  });

  it('manages key with default value', () => {
    const result = getTranslateProps('test', 'Test');
    expect(result).toEqual({ key: 'test', defaultValue: 'Test' });
  });

  it('manages key with options', () => {
    const result = getTranslateProps('test', { noWrap: true, yo: 'yo' });
    expect(result).toEqual({ key: 'test', noWrap: true, params: { yo: 'yo' } });
  });

  it('manages key default and options', () => {
    const result = getTranslateProps('test', 'Test', {
      noWrap: true,
      ns: 'test',
      orEmpty: true,
      yo: 'yo',
    });
    expect(result).toEqual(testParams);
  });
});
