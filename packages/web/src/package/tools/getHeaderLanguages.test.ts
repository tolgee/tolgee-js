import { getHeaderLanguages } from './getHeaderLanguages';

describe('language from headers', () => {
  it('parses correctly single language', () => {
    const headers = new Headers();
    headers.set('Accept-Language', 'en-US');
    expect(getHeaderLanguages(headers)).toEqual(['en-US']);
  });

  it('parses correctly multiple languages', () => {
    const headers = new Headers();
    headers.set('Accept-Language', 'en-US, en');
    expect(getHeaderLanguages(headers)).toEqual(['en-US', 'en']);
  });

  it('parses correctly star', () => {
    const headers = new Headers();
    headers.set('Accept-Language', '*');
    expect(getHeaderLanguages(headers)).toEqual([]);
  });

  it('parses correctly weighted languages', () => {
    const headers = new Headers();
    headers.set('Accept-Language', 'fr-CH, fr;q=0.9');
    expect(getHeaderLanguages(headers)).toEqual(['fr-CH', 'fr']);
  });

  it('parses correctly weighted languages with star', () => {
    const headers = new Headers();
    headers.set(
      'Accept-Language',
      'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5'
    );
    expect(getHeaderLanguages(headers)).toEqual(['fr-CH', 'fr', 'en', 'de']);
  });
});
