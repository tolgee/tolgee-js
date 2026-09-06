import { DevApiResponse, TolgeeCore } from '@tolgee/core';
import { createFetchingUtility } from './fetchingUtillity';
import { DevBackend } from '../DevBackend';

const okJson = (body: unknown): DevApiResponse => ({
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: { get: () => null },
  text: () => Promise.resolve(JSON.stringify(body)),
  json: () => Promise.resolve(body),
});

describe('can handle relative urls in apiUrl', () => {
  let f: ReturnType<typeof createFetchingUtility>;

  beforeEach(() => {
    f = createFetchingUtility();
  });

  it('dev backend can resolve relative urls', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: '/test',
        apiKey: 'test',
      });
    await expect(tolgee.loadRecord({ language: 'en' })).resolves.toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const args = fetchMock.mock.calls[0] as any;
    expect(args[0]).toEqual(
      'http://localhost/test/v2/projects/translations/en'
    );
  });

  it('an injected transport activates dev mode and the dev backend sends through it, not through fetch', async () => {
    // The extension injects a transport via overrideCredentials with no init credential; isDev() and the dev-backend
    // gate must see it, or the page silently stays on production translations.
    const fetchMock = f.fetchWithResponse({});
    const transport = jest.fn(() =>
      Promise.resolve(okJson({ en: { a: 'A' } }))
    );
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({ language: 'en', availableLanguages: ['en'], fetch: fetchMock });

    expect(tolgee.isDev()).toBe(false);
    tolgee.overrideCredentials({
      apiUrl: '/test',
      transport,
      projectId: 1,
      branch: 'feature/x',
    });

    expect(tolgee.isDev()).toBe(true);
    await expect(
      tolgee.loadRecord({ language: 'en', namespace: 'home' })
    ).resolves.toEqual({ a: 'A' });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(transport).toHaveBeenCalledTimes(1);
    const request = (transport.mock.calls[0] as any)[0];
    expect(request.path).toEqual(
      '/v2/projects/1/translations/en?branch=feature%2Fx&ns=home'
    );
    expect(request.method).toEqual('GET');
    expect(request.headers['x-tolgee-sdk-type']).toEqual('JS');
    expect(request.headers['Authorization']).toBeUndefined();
    expect(request.headers['X-API-Key']).toBeUndefined();
  });

  it('dev backend can resolve apiUrl with included path', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: 'https://test.com/abcd',
        apiKey: 'test',
      });
    await expect(tolgee.loadRecord({ language: 'en' })).resolves.toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const args = fetchMock.mock.calls[0] as any;
    expect(args[0]).toEqual(
      'https://test.com/abcd/v2/projects/translations/en'
    );
  });

  it('dev backend includes branch and ns when provided', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: 'https://test.com',
        apiKey: 'test',
        branch: 'feature/test',
      });
    await expect(
      tolgee.loadRecord({ language: 'en', namespace: 'home' })
    ).resolves.toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const args = fetchMock.mock.calls[0] as any;
    const url = new URL(args[0]);
    expect(url.searchParams.get('branch')).toEqual('feature/test');
    expect(url.searchParams.get('ns')).toEqual('home');
  });
});

describe('dev backend authentication headers', () => {
  let f: ReturnType<typeof createFetchingUtility>;

  beforeEach(() => {
    f = createFetchingUtility();
  });

  const lowerCasedHeadersOf = (fetchMock: any) =>
    fetchMock.mock.calls[0][1].headers as Record<string, string>;

  it('sends X-API-Key and no Authorization for an api key', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: '/test',
        apiKey: 'test',
      });
    await tolgee.loadRecord({ language: 'en' });
    const headers = lowerCasedHeadersOf(fetchMock);
    expect(headers['x-api-key']).toEqual('test');
    expect(headers['authorization']).toBeUndefined();
  });

  it('does not send when signed in through the extension without a projectId', async () => {
    const fetchMock = f.fetchWithResponse({});
    const transport = jest.fn();
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({ language: 'en', availableLanguages: ['en'], fetch: fetchMock });
    tolgee.overrideCredentials({ apiUrl: '/test', transport });
    const errorHandler = jest.fn();
    tolgee.on('error', errorHandler);
    await tolgee.loadRecord({ language: 'en' });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(transport).not.toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('does not fetch when a PAT (tgpat) key is used without a projectId', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: '/test',
        apiKey: 'tgpat_x',
      });
    const errorHandler = jest.fn();
    tolgee.on('error', errorHandler);
    await tolgee.loadRecord({ language: 'en' });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalled();
  });
});
