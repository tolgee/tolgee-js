jest.autoMockOff();
import { IcuFormatter } from './IcuFormatter';

describe('icu formatter', () => {
  it('formats simple string', () => {
    const formatter = new IcuFormatter();
    const result = formatter.format({
      translation: 'result is {number, number}',
      params: { number: 42000 },
      language: 'en',
    });
    expect(result).toEqual('result is 42,000');
  });

  it('fixes invalid locale', () => {
    const formatter = new IcuFormatter() as any;
    expect(formatter.getLocale('en_GB')).toEqual('en-GB');
    expect(formatter.getLocale('en_GB-nonsenceeeee')).toEqual('en-GB');
    expect(formatter.getLocale('cs CZ')).toEqual('cs-CZ');
  });
});
