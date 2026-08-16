import { TolgeeCore } from '@tolgee/core';
import { createFetchingUtility } from './fetchingUtillity';
import { DevBackend } from '../DevBackend';
import { AUTH_TOKEN_SESSION_STORAGE } from '../tools/sessionStorageKeys';

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

  afterEach(() => {
    sessionStorage.clear();
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

  it('sends a Bearer token and no X-API-Key for an OAuth token', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: '/test',
        authToken: 'jwt',
        projectId: 1,
      });
    await tolgee.loadRecord({ language: 'en' });
    const headers = lowerCasedHeadersOf(fetchMock);
    expect(headers['authorization']).toEqual('Bearer jwt');
    expect(headers['x-api-key']).toBeUndefined();
    expect(headers['x-tolgee-sdk-type']).toEqual('JS');
  });

  it('does not fetch when an OAuth token is used without a projectId', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: '/test',
        authToken: 'jwt',
      });
    await tolgee.loadRecord({ language: 'en' });
    expect(fetchMock).not.toHaveBeenCalled();
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
    await tolgee.loadRecord({ language: 'en' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('prefers a live rotated sessionStorage token over the init token', async () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'rotated');
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: '/test',
        authToken: 'init-token',
        projectId: 1,
      });
    await tolgee.loadRecord({ language: 'en' });
    expect(lowerCasedHeadersOf(fetchMock)['authorization']).toEqual(
      'Bearer rotated'
    );
  });
});
