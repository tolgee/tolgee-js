import { TolgeeCore } from '../TolgeeCore';
import { DevApiTransport, DevCredentials, TolgeeOptions } from '../types';

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

  it('overrideCredentials with branch', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'http://localhost:8080',
    });

    tolgee.overrideCredentials({
      apiUrl: 'http://localhost:8000',
      apiKey: 'test',
      branch: 'feature-x',
    });

    expect(tolgee.getInitialOptions().branch).toEqual('feature-x');
  });

  it('overrideCredentials branch overrides init branch', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'http://localhost:8080',
      branch: 'original',
    });

    tolgee.overrideCredentials({
      apiUrl: 'http://localhost:8000',
      apiKey: 'test',
      branch: 'override',
    });

    expect(tolgee.getInitialOptions().branch).toEqual('override');
  });

  it('an injected apiKey fully replaces an injected transport', () => {
    const transport = jest.fn();
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'http://localhost:8080',
    });

    tolgee.overrideCredentials({
      apiUrl: 'http://localhost:8000',
      transport,
      projectId: 1,
    });
    tolgee.overrideCredentials({
      apiUrl: 'http://localhost:8000',
      apiKey: 'tgpak_x',
      projectId: 1,
    });

    const options = tolgee.getInitialOptions();
    expect(options.apiKey).toEqual('tgpak_x');
    expect(options.transport).toBeUndefined();
  });

  it('an override without a credential preserves the init auth method', () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'http://localhost:8080',
      apiKey: 'tgpak_x',
    });

    tolgee.overrideCredentials({
      apiUrl: 'http://localhost:8000',
      branch: 'feature',
    });

    const options = tolgee.getInitialOptions();
    expect(options.apiKey).toEqual('tgpak_x');
    expect(options.transport).toBeUndefined();
    expect(options.branch).toEqual('feature');
  });

  it('an injected transport fully replaces a statically-configured apiKey', () => {
    const transport = jest.fn();
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'http://localhost:8080',
      apiKey: 'tgpak_x',
    });

    tolgee.overrideCredentials({
      apiUrl: 'http://localhost:8000',
      transport,
      projectId: 1,
    });

    const options = tolgee.getInitialOptions();
    expect(options.transport).toBe(transport);
    expect(options.apiKey).toBeUndefined();
  });

  it('does not accept the extension transport, which only enters through overrideCredentials', () => {
    const transport: DevApiTransport = () =>
      Promise.reject(new Error('unused'));
    // @ts-expect-error transport is not an init option
    const options: TolgeeOptions = { transport };
    const credentials: DevCredentials = { transport, projectId: 1 };

    expect(options).toBeDefined();
    expect(credentials.transport).toBe(transport);
  });
});
