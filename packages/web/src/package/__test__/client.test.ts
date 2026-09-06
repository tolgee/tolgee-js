import { client } from '../ui/client/client';
import { DevApiRequest, DevApiResponse } from '@tolgee/core';
import { EDITING_SESSION_STORAGE } from '../tools/sessionStorageKeys';

describe('in-context client auth (customFetch)', () => {
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
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

  const okResponse = (body = '{}'): DevApiResponse => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: { get: (name) => (name === 'X-Tolgee-Version' ? '3.9' : null) },
    text: () => Promise.resolve(body),
    json: () => Promise.resolve(JSON.parse(body)),
  });

  const mockTransport = (response: DevApiResponse = okResponse()) =>
    jest.fn((_request: DevApiRequest) => Promise.resolve(response));

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

  it('sends X-API-Key for an api key', async () => {
    const fetchMock = mockFetch();
    await call({ apiKey: 'tgpak_x' });
    const headers = lowerCasedHeadersOf(fetchMock);
    expect(headers['x-api-key']).toEqual('tgpak_x');
    expect(headers['authorization']).toBeUndefined();
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

  it("scopes a PAK request to the key's own project, not the configured one", async () => {
    // See decodeApiKey.test.ts for how a tgpak's embedded project id is decoded.
    const fetchMock = mockFetch();
    await client(
      '/v2/projects/keys' as any,
      'get' as any,
      {} as any,
      {
        apiUrl: 'http://localhost',
        apiKey: 'tgpak_gfpxm4lin4zdazleoq4gm2rumfxgi2lfom2gw4dpguzxc',
        projectId: 9,
      } as any
    );
    const url = (fetchMock.mock.calls[0] as unknown as [string])[0];
    expect(url).toContain('/v2/projects/1/keys');
  });

  it('uses the transport, sends a path only and sets no auth header', async () => {
    const transport = mockTransport();
    const fetchMock = mockFetch();
    await client(
      '/v2/projects/keys' as any,
      'get' as any,
      { query: { size: 5 } } as any,
      { apiUrl: 'http://localhost', transport, projectId: 7 } as any
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(transport).toHaveBeenCalledTimes(1);
    const request = transport.mock.calls[0][0];
    expect(request.path).toEqual('/v2/projects/7/keys?size=5');
    expect(request.method).toEqual('get');
    expect(request.headers['x-tolgee-sdk-type']).toEqual('JS');
    expect(request.headers['x-tolgee-sdk-version']).toBeDefined();
    expect(request.headers['Authorization']).toBeUndefined();
    expect(request.headers['X-API-Key']).toBeUndefined();
    expect(request.body).toBeUndefined();
  });

  it('lets the transport win over an api key still in the options', async () => {
    const transport = mockTransport();
    const fetchMock = mockFetch();
    await call({ transport, apiKey: 'tgpak_x' });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(transport.mock.calls[0][0].headers['X-API-Key']).toBeUndefined();
  });

  it('hands a json body and its content type to the transport', async () => {
    const transport = mockTransport();
    await client(
      '/v2/projects/keys' as any,
      'post' as any,
      { content: { 'application/json': { name: 'k' } } } as any,
      { apiUrl: 'http://localhost', transport, projectId: 7 } as any
    );

    const request = transport.mock.calls[0][0];
    expect(request.method).toEqual('post');
    expect(request.body).toEqual('{"name":"k"}');
    expect(request.headers['Content-Type']).toEqual('application/json');
  });

  it('hands a multipart body to the transport as FormData', async () => {
    const transport = mockTransport();
    const image = new Blob(['img'], { type: 'image/png' });
    await client(
      '/v2/image-upload' as any,
      'post' as any,
      { content: { 'multipart/form-data': { image } } } as any,
      { apiUrl: 'http://localhost', transport, projectId: 7 } as any
    );

    const request = transport.mock.calls[0][0];
    expect(request.body).toBeInstanceOf(FormData);
    expect((request.body as FormData).get('image')).toBeTruthy();
    expect(request.headers['Content-Type']).toBeUndefined();
  });

  it('parses the transport response like a fetch response, version header included', async () => {
    const transport = mockTransport(okResponse('{"id":5}'));
    const result = (await call({ transport })) as any;
    expect(result.id).toEqual(5);
    expect(result._internal.version).toEqual('3.9');
  });

  it('turns a transport error response into the same HttpError a fetch would', async () => {
    const transport = mockTransport({
      ...okResponse(
        '{"code":"operation_not_permitted","params":["keys.edit"]}'
      ),
      ok: false,
      status: 403,
    });
    await expect(call({ transport })).rejects.toMatchObject({
      code: 'operation_not_permitted',
      status: 403,
      params: ['keys.edit'],
    });
  });

  it('throws when neither an api key nor a transport is available', async () => {
    mockFetch();
    await expect(call({})).rejects.toThrow('api_key_not_specified');
  });

  describe('editing switched off in the extension', () => {
    afterEach(() => {
      sessionStorage.removeItem(EDITING_SESSION_STORAGE);
    });

    it('throws extension_editing_off instead of api_key_not_specified while the page has no credential', async () => {
      sessionStorage.setItem(EDITING_SESSION_STORAGE, 'off');
      mockFetch();
      await expect(call({})).rejects.toThrow('extension_editing_off');
    });

    it('leaves a page that still has a credential alone', async () => {
      sessionStorage.setItem(EDITING_SESSION_STORAGE, 'off');
      const fetchMock = mockFetch();
      await call({ apiKey: 'tgpak_x' });
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const transport = mockTransport();
      await call({ transport });
      expect(transport).toHaveBeenCalledTimes(1);
    });

    it('asks to sign in as before once the slot is gone or holds anything but off', async () => {
      mockFetch();
      sessionStorage.setItem(EDITING_SESSION_STORAGE, 'on');
      await expect(call({})).rejects.toThrow('api_key_not_specified');
      sessionStorage.removeItem(EDITING_SESSION_STORAGE);
      await expect(call({})).rejects.toThrow('api_key_not_specified');
    });
  });

  it('throws project_id_not_specified for a request through the extension to a project endpoint with no projectId', async () => {
    const transport = mockTransport();
    await expect(call({ transport, projectId: undefined })).rejects.toThrow(
      'project_id_not_specified'
    );
    expect(transport).not.toHaveBeenCalled();
  });

  it('allows a request through the extension to a non-project endpoint without a projectId', async () => {
    const transport = mockTransport();
    await client(
      '/v2/image-upload' as any,
      'post' as any,
      {} as any,
      { apiUrl: 'http://localhost', transport } as any
    );
    expect(transport).toHaveBeenCalledTimes(1);
    expect(transport.mock.calls[0][0].path).toEqual('/v2/image-upload');
  });
});
