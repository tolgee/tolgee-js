import {
  directTransport,
  encodeBody,
  httpErrorFromExtension,
  proxyTransport,
  toResponseLike,
} from './apiTransport';
import { ExtensionRpcError } from './extensionRpc';
import { HttpError } from '../ui/client/HttpError';
import { errorFromResponse, readApiResponse } from '../ui/client/client';
import { dispatchExtensionMessage as dispatch } from '../__test__/testDispatch';

const settle = () => new Promise((r) => setTimeout(r, 20));

describe('directTransport', () => {
  it('joins the api url and the path, and sends the auth header last', async () => {
    const fetch = jest.fn(() => Promise.resolve({ ok: true } as Response));
    const send = directTransport({
      apiUrl: 'https://app.tolgee.io/',
      fetch,
      authHeader: { 'X-API-Key': 'tgpak_x' },
    });
    await send({
      path: '/v2/projects/keys?size=1',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': 'forged' },
      body: '{}',
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://app.tolgee.io/v2/projects/keys?size=1',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': 'tgpak_x' },
        body: '{}',
      })
    );
  });
});

describe('encodeBody', () => {
  it('encodes no body, a json body, and a FormData with files as base64', async () => {
    expect(await encodeBody(undefined)).toEqual({ kind: 'none' });
    expect(await encodeBody('{"a":1}')).toEqual({
      kind: 'json',
      text: '{"a":1}',
    });

    const form = new FormData();
    form.append('image', new File(['abc'], 'pic.png', { type: 'image/png' }));
    form.append('info', '{"x":1}');
    expect(await encodeBody(form)).toEqual({
      kind: 'form',
      entries: [
        {
          name: 'image',
          file: { name: 'pic.png', type: 'image/png', base64: btoa('abc') },
        },
        { name: 'info', value: '{"x":1}' },
      ],
    });
  });
});

describe('toResponseLike', () => {
  it('feeds errorFromResponse and readApiResponse like a fetch Response would', async () => {
    const failed = toResponseLike({
      status: 403,
      statusText: 'Forbidden',
      headers: { 'content-type': 'application/json', 'x-tolgee-version': null },
      body: '{"code":"operation_not_permitted","params":["keys.edit"]}',
    });
    expect(failed.ok).toBe(false);
    expect(errorFromResponse(failed.status, await failed.json())).toMatchObject(
      { code: 'operation_not_permitted', status: 403, params: ['keys.edit'] }
    );
    await expect(readApiResponse(failed)).rejects.toMatchObject({
      code: 'operation_not_permitted',
    });

    const ok = toResponseLike({
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-tolgee-version': '3.9',
      },
      body: '{"id":1}',
    });
    expect(ok.ok).toBe(true);
    expect(ok.headers.get('X-Tolgee-Version')).toBe('3.9');
    expect(await readApiResponse(ok)).toEqual({
      id: 1,
      _internal: { version: '3.9' },
    });
  });
});

describe('httpErrorFromExtension', () => {
  it('maps the extension error kinds onto HttpError codes', () => {
    expect(
      httpErrorFromExtension(new ExtensionRpcError('no_session', 'x'))
    ).toMatchObject({ code: 'extension_session_missing', status: 401 });
    expect(
      httpErrorFromExtension(new ExtensionRpcError('too_large', 'x'))
    ).toMatchObject({ code: 'extension_request_too_large' });
    for (const kind of ['not_allowed', 'network', 'timeout', 'unavailable']) {
      expect(
        httpErrorFromExtension(new ExtensionRpcError(kind as any, 'x'))
      ).toMatchObject({ code: 'fetch_error' });
    }
    const passthrough = new HttpError('branch_not_found', 404);
    expect(httpErrorFromExtension(passthrough)).toBe(passthrough);
    expect(httpErrorFromExtension(new Error('boom'))).toMatchObject({
      code: 'fetch_error',
    });
  });
});

describe('proxyTransport', () => {
  const posted: any[] = [];
  const listener = (event: MessageEvent) => {
    if (event.data?.type === 'TOLGEE_PROXY_PING') {
      dispatch('TOLGEE_PROXY_PONG', { protocolVersion: 2 });
    }
    if (event.data?.type === 'TOLGEE_API_REQUEST') {
      posted.push(event.data.data);
    }
  };
  beforeEach(() => {
    posted.length = 0;
    window.addEventListener('message', listener);
  });
  afterEach(() => window.removeEventListener('message', listener));

  const reply = (id: string, data: Record<string, unknown>) =>
    dispatch('TOLGEE_API_RESPONSE', { id, ...data });

  it('posts the request with an encoded body and resolves a Response-like object', async () => {
    const send = proxyTransport();
    const form = new FormData();
    form.append('image', new File(['abc'], 'pic.png', { type: 'image/png' }));
    const promise = send({
      path: '/v2/image-upload',
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: form,
    });
    await settle();
    expect(posted).toHaveLength(1);
    const { id, ...request } = posted[0];
    expect(request).toEqual({
      path: '/v2/image-upload',
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: {
        kind: 'form',
        entries: [
          {
            name: 'image',
            file: { name: 'pic.png', type: 'image/png', base64: btoa('abc') },
          },
        ],
      },
    });
    reply(id, {
      response: {
        status: 201,
        statusText: 'Created',
        headers: { 'content-type': 'application/json' },
        body: '{"id":9}',
      },
    });
    const response = await promise;
    expect(response.ok).toBe(true);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: 9 });
  });

  it('rejects with the mapped HttpError when the extension reports an error', async () => {
    const send = proxyTransport();
    const promise = send({ path: '/v2/x', method: 'GET', headers: {} });
    await settle();
    reply(posted[0].id, { error: { kind: 'no_session', message: 'x' } });
    await expect(promise).rejects.toMatchObject({
      code: 'extension_session_missing',
      status: 401,
    });
    await expect(promise).rejects.toBeInstanceOf(HttpError);
  });
});
