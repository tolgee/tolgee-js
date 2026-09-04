import { client } from '../ui/client/client';
import { AUTH_TOKEN_SESSION_STORAGE } from '../tools/sessionStorageKeys';

describe('in-context client auth (customFetch)', () => {
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
    sessionStorage.clear();
  });

  const mockFetch = () => {
    const fn = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('{}'),
        headers: { get: () => null },
      } as unknown as Response)
    );
    global.fetch = fn as any;
    return fn;
  };

  const call = (options: Record<string, unknown>) =>
    client(
      '/v2/projects/{projectId}/keys' as any,
      'get' as any,
      {} as any,
      {
        apiUrl: 'http://localhost',
        projectId: 1,
        ...options,
      } as any
    );

  const lowerCasedHeadersOf = (fetchMock: any) =>
    fetchMock.mock.calls[0][1].headers as Record<string, string>;

  it('sends Authorization: Bearer for an OAuth token', async () => {
    const fetchMock = mockFetch();
    await call({ authToken: 'jwt' });
    const headers = lowerCasedHeadersOf(fetchMock);
    expect(headers['authorization']).toEqual('Bearer jwt');
    expect(headers['x-api-key']).toBeUndefined();
  });

  it('scopes the Bearer request URL to the supplied projectId', async () => {
    const fetchMock = mockFetch();
    // Real project endpoints omit the project segment (they assume a PAK); a Bearer token carries none, so the client
    // must inject the explicit projectId into the path.
    await client(
      '/v2/projects/keys' as any,
      'get' as any,
      {} as any,
      {
        apiUrl: 'http://localhost',
        authToken: 'jwt',
        projectId: 7,
      } as any
    );
    const url = (fetchMock.mock.calls[0] as unknown as [string])[0];
    expect(url).toContain('/v2/projects/7/keys');
  });

  it('scopes a PAT request to its explicit projectId and sends X-API-Key', async () => {
    const fetchMock = mockFetch();
    await client(
      '/v2/projects/keys' as any,
      'get' as any,
      {} as any,
      {
        apiUrl: 'http://localhost',
        apiKey: 'tgpat_x',
        projectId: 9,
      } as any
    );
    const url = (fetchMock.mock.calls[0] as unknown as [string])[0];
    expect(url).toContain('/v2/projects/9/keys');
    expect(lowerCasedHeadersOf(fetchMock)['x-api-key']).toEqual('tgpat_x');
  });

  it('sends X-API-Key for an api key', async () => {
    const fetchMock = mockFetch();
    await call({ apiKey: 'tgpak_x' });
    const headers = lowerCasedHeadersOf(fetchMock);
    expect(headers['x-api-key']).toEqual('tgpak_x');
    expect(headers['authorization']).toBeUndefined();
  });

  it('attaches SDK type/version headers on a Bearer request', async () => {
    const fetchMock = mockFetch();
    await call({ authToken: 'jwt' });
    const headers = lowerCasedHeadersOf(fetchMock);
    expect(headers['x-tolgee-sdk-type']).toEqual('JS');
    expect(headers['x-tolgee-sdk-version']).toBeDefined();
  });

  it('prefers a live sessionStorage token over the init token', async () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'rotated');
    const fetchMock = mockFetch();
    await call({ authToken: 'init-token' });
    expect(lowerCasedHeadersOf(fetchMock)['authorization']).toEqual(
      'Bearer rotated'
    );
  });

  it('does not let a stray sessionStorage token hijack a configured api key', async () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'stray');
    const fetchMock = mockFetch();
    await call({ apiKey: 'tgpak_x' });
    const headers = lowerCasedHeadersOf(fetchMock);
    expect(headers['x-api-key']).toEqual('tgpak_x');
    expect(headers['authorization']).toBeUndefined();
  });

  it('throws when neither an api key nor a token is available', async () => {
    mockFetch();
    await expect(call({})).rejects.toThrow('api_key_not_specified');
  });

  it('throws project_id_not_specified for an OAuth request to a project endpoint with no projectId', async () => {
    mockFetch();
    await expect(
      call({ authToken: 'jwt', projectId: undefined })
    ).rejects.toThrow('project_id_not_specified');
  });

  it('allows an OAuth request to a non-project endpoint without a projectId', async () => {
    const fetchMock = mockFetch();
    await client(
      '/v2/image-upload' as any,
      'post' as any,
      {} as any,
      {
        apiUrl: 'http://localhost',
        authToken: 'jwt',
      } as any
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(lowerCasedHeadersOf(fetchMock)['authorization']).toEqual(
      'Bearer jwt'
    );
  });

  it('enforces the projectId precondition off the live token, not just the init options', async () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'live');
    mockFetch();
    await expect(call({ projectId: undefined })).rejects.toThrow(
      'project_id_not_specified'
    );
  });
});
