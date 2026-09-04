import {
  ExtensionRpcError,
  requestFromExtension,
  uploadScreenshotViaExtension,
} from './extensionRpc';

type Sent = { type: string; data: { id: string } & Record<string, unknown> };

// jsdom's own postMessage carries no source or origin; a real browser stamps both, and the SDK checks them.
const dispatch = (type: string, data: unknown) =>
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { type, data },
      origin: window.location.origin,
      source: window,
    })
  );

// A fake extension relay: sees what the page posts, answers on the same window under the same id.
let answerPings = true;
const pings: number[] = [];

const relay = () => {
  const sent: Sent[] = [];
  const listener = (event: MessageEvent) => {
    if (event.data?.type === 'TOLGEE_PROXY_PING') {
      pings.push(Date.now());
      if (answerPings) {
        dispatch('TOLGEE_PROXY_PONG', { protocolVersion: 2 });
      }
      return;
    }
    if (event.data?.type?.startsWith('TOLGEE_') && event.data?.data?.id) {
      if (
        event.data.type.endsWith('_RESPONSE') ||
        event.data.type.endsWith('_UPLOADED')
      ) {
        return;
      }
      if (event.data.type === 'TOLGEE_SCREENSHOT_CAPTURED') {
        return;
      }
      sent.push(event.data);
    }
  };
  window.addEventListener('message', listener);
  const answer = (type: string, data: Record<string, unknown>) =>
    dispatch(type, data);
  return {
    sent,
    answer,
    detach: () => window.removeEventListener('message', listener),
  };
};

const settle = () => new Promise((r) => setTimeout(r, 20));

describe('requestFromExtension', () => {
  let r: ReturnType<typeof relay>;
  beforeEach(() => {
    jest.useRealTimers();
    answerPings = true;
    pings.length = 0;
    r = relay();
  });
  afterEach(() => r.detach());

  it('posts the request only once the relay has answered a ping, and pings again until it does', async () => {
    answerPings = false;
    const promise = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      timeoutMs: 5_000,
    });
    await new Promise((resolve) => setTimeout(resolve, 650));
    expect(r.sent).toHaveLength(0);
    expect(pings.length).toBeGreaterThanOrEqual(3);

    answerPings = true;
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(r.sent).toHaveLength(1);
    r.answer('TOLGEE_API_RESPONSE', { id: r.sent[0].data.id, response: {} });
    await promise;

    // Once the relay is known to be there, later requests do not wait for another ping.
    pings.length = 0;
    const second = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
    });
    await settle();
    expect(r.sent).toHaveLength(2);
    expect(pings).toEqual([]);
    r.answer('TOLGEE_API_RESPONSE', { id: r.sent[1].data.id, response: {} });
    await second;
  });

  it('posts the payload under a fresh id and resolves the reply carrying that id', async () => {
    const promise = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      payload: { path: '/v2/x', method: 'GET' },
    });
    await settle();
    expect(r.sent).toHaveLength(1);
    const { id, ...rest } = r.sent[0].data;
    expect(typeof id).toBe('string');
    expect(rest).toEqual({ path: '/v2/x', method: 'GET' });

    r.answer('TOLGEE_API_RESPONSE', { id, response: { status: 200 } });
    expect(await promise).toEqual({ id, response: { status: 200 } });
  });

  it('keeps concurrent requests apart by id, whatever order the replies arrive in', async () => {
    const a = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      payload: { path: '/a' },
    });
    const b = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      payload: { path: '/b' },
    });
    await settle();
    const [idA, idB] = r.sent.map((s) => s.data.id);
    expect(idA).not.toEqual(idB);

    r.answer('TOLGEE_API_RESPONSE', { id: idB, response: { body: 'B' } });
    r.answer('TOLGEE_API_RESPONSE', { id: idA, response: { body: 'A' } });
    expect((await a).response).toEqual({ body: 'A' });
    expect((await b).response).toEqual({ body: 'B' });
  });

  it('rejects with the error kind the extension answers', async () => {
    const promise = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
    });
    await settle();
    r.answer('TOLGEE_API_RESPONSE', {
      id: r.sent[0].data.id,
      error: { kind: 'no_session', message: 'nope' },
    });
    await expect(promise).rejects.toMatchObject({ kind: 'no_session' });
    await expect(promise).rejects.toBeInstanceOf(ExtensionRpcError);
  });

  it('ignores a reply from another origin or another window', async () => {
    const promise = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      timeoutMs: 200,
    });
    await settle();
    const id = r.sent[0].data.id;
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'TOLGEE_API_RESPONSE', data: { id, response: {} } },
        origin: 'https://evil.example',
        source: window,
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'TOLGEE_API_RESPONSE', data: { id, response: {} } },
        origin: window.location.origin,
        source: null,
      })
    );
    await expect(promise).rejects.toMatchObject({ kind: 'unavailable' });
  });

  it('rejects as unavailable when nothing answers in time', async () => {
    const promise = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      timeoutMs: 50,
    });
    await expect(promise).rejects.toMatchObject({
      kind: 'unavailable',
      message: expect.stringContaining('TOLGEE_API_REQUEST'),
    });
  });

  it('ignores a reply of another type for the same id', async () => {
    const promise = requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      timeoutMs: 200,
    });
    await settle();
    r.answer('TOLGEE_SCREENSHOT_UPLOADED', {
      id: r.sent[0].data.id,
      response: {},
    });
    await expect(promise).rejects.toMatchObject({ kind: 'unavailable' });
  });
});

describe('uploadScreenshotViaExtension', () => {
  let r: ReturnType<typeof relay>;
  beforeEach(() => {
    r = relay();
  });
  afterEach(() => r.detach());

  it('reports the capture before the upload result, both under the request id', async () => {
    const events: string[] = [];
    const promise = uploadScreenshotViaExtension(() => events.push('captured'));
    await settle();
    expect(r.sent).toEqual([
      { type: 'TOLGEE_SCREENSHOT_UPLOAD', data: { id: expect.any(String) } },
    ]);
    const id = r.sent[0].data.id;

    r.answer('TOLGEE_SCREENSHOT_CAPTURED', { id });
    await settle();
    expect(events).toEqual(['captured']);

    r.answer('TOLGEE_SCREENSHOT_UPLOADED', {
      id,
      response: { status: 201, body: '{"id":1}' },
      width: 800,
      height: 600,
    });
    const result = await promise;
    events.push('uploaded');
    expect(result).toMatchObject({
      response: { status: 201 },
      width: 800,
      height: 600,
    });
    expect(events).toEqual(['captured', 'uploaded']);
  });

  it('does not fire the capture callback for another request id', async () => {
    const onCaptured = jest.fn();
    const promise = uploadScreenshotViaExtension(onCaptured);
    await settle();
    const id = r.sent[0].data.id;
    r.answer('TOLGEE_SCREENSHOT_CAPTURED', { id: 'someone-else' });
    await settle();
    expect(onCaptured).not.toHaveBeenCalled();
    r.answer('TOLGEE_SCREENSHOT_UPLOADED', {
      id,
      error: { kind: 'no_session', message: 'x' },
    });
    await expect(promise).rejects.toMatchObject({ kind: 'no_session' });
    expect(onCaptured).not.toHaveBeenCalled();
  });
});
