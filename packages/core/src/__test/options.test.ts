import { TolgeeCore } from '../TolgeeCore';

describe('initial options', () => {
  it('combines options correctly', () => {
    const tolgee = TolgeeCore()
      .updateDefaults({
        observerType: 'text',
        observerOptions: { highlightColor: 'red', restrictedElements: ['a'] },
        apiUrl: 'https://app.tolgee.io',
        language: 'en',
      })
      .init({
        language: 'cs',
        apiUrl: 'http://localhost:8080',
        observerOptions: { highlightWidth: 90 },
      });

    expect(tolgee.getInitialOptions().apiUrl).toEqual('http://localhost:8080');

    tolgee.updateOptions({
      apiUrl: 'http://localhost:8202',
    });

    const {
      observerType,
      apiUrl,
      language,
      defaultNs,
      observerOptions: {
        highlightColor,
        highlightWidth,
        restrictedElements,
        inputPrefix,
      },
    } = tolgee.getInitialOptions();

    expect(apiUrl).toEqual('http://localhost:8202');
    expect(observerType).toEqual('text');
    expect(language).toEqual('cs');
    expect(highlightWidth).toEqual(90);
    expect(restrictedElements).toEqual(['a']);
    expect(highlightColor).toEqual('red');
    expect(inputPrefix).toEqual('%-%tolgee:');
    expect(defaultNs).toEqual(undefined);
  });

  it('sanitizes url', () => {
    const tolgee = TolgeeCore().init({
      language: 'cs',
      apiUrl: 'http://localhost:8080/',
      observerOptions: { highlightWidth: 90 },
    });

    expect(tolgee.getInitialOptions().apiUrl).toEqual('http://localhost:8080');

    tolgee.updateOptions({ apiUrl: 'http://localhost:8202/' });

    expect(tolgee.getInitialOptions().apiUrl).toEqual('http://localhost:8202');

    tolgee.overrideCredentials({ apiUrl: 'http://localhost:8000/' });

    expect(tolgee.getInitialOptions().apiUrl).toEqual('http://localhost:8000');
  });
});
