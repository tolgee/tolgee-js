import type {
  DevApiRequest,
  DevApiResponse,
  DevApiTransport,
  FetchFn,
} from '@tolgee/core';
import { createUrl } from './url';
import { HttpError } from '../ui/client/HttpError';
import {
  ExtensionApiResponse,
  ExtensionRpcError,
  requestFromExtension,
} from './extensionRpc';

type DirectProps = {
  apiUrl: string;
  fetch: FetchFn;
  authHeader: Record<string, string>;
};

/** Today's request path: the page holds the credential and calls the server itself. */
export function directTransport({
  apiUrl,
  fetch,
  authHeader,
}: DirectProps): DevApiTransport {
  return (request) =>
    fetch(createUrl(apiUrl, request.path).toString(), {
      method: request.method,
      headers: { ...request.headers, ...authHeader },
      body: request.body,
      // @ts-ignore - tell next.js to not use cache
      next: { revalidate: 0 },
    });
}

export type ProxyFormEntry =
  | { name: string; value: string }
  | { name: string; file: { name: string; type: string; base64: string } };

export type ProxyBody =
  | { kind: 'none' }
  | { kind: 'json'; text: string }
  | { kind: 'form'; entries: ProxyFormEntry[] };

/** The extension's service worker performs the request; the page never sees the token. */
export function proxyTransport(): DevApiTransport {
  return async (request) => {
    const body = await encodeBody(request.body);
    let reply: { response?: ExtensionApiResponse };
    try {
      reply = await requestFromExtension({
        type: 'TOLGEE_API_REQUEST',
        replyType: 'TOLGEE_API_RESPONSE',
        payload: {
          path: request.path,
          method: request.method,
          headers: request.headers,
          body,
        },
      });
    } catch (e) {
      throw httpErrorFromExtension(e);
    }
    if (!reply.response) {
      throw new HttpError('fetch_error');
    }
    return toResponseLike(reply.response);
  };
}

export async function encodeBody(
  body: DevApiRequest['body']
): Promise<ProxyBody> {
  if (body === undefined) {
    return { kind: 'none' };
  }
  if (typeof body === 'string') {
    return { kind: 'json', text: body };
  }
  const entries: Promise<ProxyFormEntry>[] = [];
  body.forEach((value, name) => {
    if (typeof value === 'string') {
      entries.push(Promise.resolve({ name, value }));
      return;
    }
    entries.push(
      blobToBase64(value).then((base64) => ({
        name,
        file: { name: value.name || 'blob', type: value.type, base64 },
      }))
    );
  });
  return { kind: 'form', entries: await Promise.all(entries) };
}

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(String(reader.result).replace(/^data:[^,]*,/, ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export function toResponseLike(response: ExtensionApiResponse): DevApiResponse {
  const headers = Object.fromEntries(
    Object.entries(response.headers ?? {}).map(([name, value]) => [
      name.toLowerCase(),
      value,
    ])
  );
  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    statusText: response.statusText,
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    text: () => Promise.resolve(response.body),
    json: () => Promise.resolve(JSON.parse(response.body)),
  };
}

export function httpErrorFromExtension(e: unknown): HttpError {
  if (e instanceof HttpError) {
    return e;
  }
  if (e instanceof ExtensionRpcError) {
    switch (e.kind) {
      case 'no_session':
        return new HttpError('extension_session_missing', 401);
      case 'too_large':
        return new HttpError('extension_request_too_large');
      default:
        return new HttpError('fetch_error');
    }
  }
  return new HttpError('fetch_error');
}
