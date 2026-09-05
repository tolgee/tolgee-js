import { dispatchExtensionMessage as dispatch } from './testDispatch';
type Rpc = typeof import('./extensionRpc');

// extensionRpc remembers a confirmed relay for the life of the module, so every case gets its own instance.
let rpc: Rpc;
beforeEach(() => {
  jest.isolateModules(() => {
    rpc = require('./extensionRpc');
  });
});

type Sent = { type: string; data: { id: string } & Record<string, unknown> };

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

  it('rejects as unavailable when the relay never answers a single ping', async () => {
    answerPings = false;
    const promise = rpc.requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      timeoutMs: 250,
    });
    await expect(promise).rejects.toMatchObject({
      kind: 'unavailable',
      message: expect.stringContaining('did not answer'),
    });
    expect(r.sent).toHaveLength(0);
    expect(pings.length).toBeGreaterThan(0);
  });

  it('gives up on a relay that never answers after RELAY_DISCOVERY_TIMEOUT_MS, not after the full request timeout', async () => {
    jest.useFakeTimers();
    try {
      answerPings = false;
      const promise = rpc.requestFromExtension({
        type: 'TOLGEE_API_REQUEST',
        replyType: 'TOLGEE_API_RESPONSE',
      });
      const outcome = promise.then(
        () => 'resolved',
        () => 'rejected'
      );
      await jest.advanceTimersByTimeAsync(rpc.RELAY_DISCOVERY_TIMEOUT_MS - 500);
      expect(await Promise.race([outcome, Promise.resolve('pending')])).toBe(
        'pending'
      );
      await jest.advanceTimersByTimeAsync(1_000);
      expect(await outcome).toBe('rejected');
      await expect(promise).rejects.toMatchObject({ kind: 'unavailable' });
      expect(r.sent).toHaveLength(0);
    } finally {
      jest.useRealTimers();
    }
  });

  it('caps the total wait at timeoutMs when the relay answers late, instead of stacking a second full wait for the reply', async () => {
    answerPings = false;
    const start = Date.now();
    const promise = rpc.requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      timeoutMs: 600,
    });
    setTimeout(() => {
      answerPings = true;
    }, 250);

    await expect(promise).rejects.toMatchObject({ kind: 'unavailable' });

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(550);
    expect(elapsed).toBeLessThan(800);
  });

  it('posts the request only once the relay has answered a ping, and pings again until it does', async () => {
    answerPings = false;
    const promise = rpc.requestFromExtension({
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
    const second = rpc.requestFromExtension({
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
    const promise = rpc.requestFromExtension({
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
    const a = rpc.requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      payload: { path: '/a' },
    });
    const b = rpc.requestFromExtension({
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
    const promise = rpc.requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
    });
    await settle();
    r.answer('TOLGEE_API_RESPONSE', {
      id: r.sent[0].data.id,
      error: { kind: 'no_session', message: 'nope' },
    });
    await expect(promise).rejects.toMatchObject({ kind: 'no_session' });
    await expect(promise).rejects.toBeInstanceOf(rpc.ExtensionRpcError);
  });

  it('ignores a reply from another origin or another window', async () => {
    const promise = rpc.requestFromExtension({
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
    const promise = rpc.requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      timeoutMs: 50,
    });
    await expect(promise).rejects.toMatchObject({
      kind: 'unavailable',
      message: expect.stringContaining('TOLGEE_API_REQUEST'),
    });
  });

  it('re-discovers the relay after a request went unanswered, so a removed extension fails fast again', async () => {
    const first = rpc.requestFromExtension({
      type: 'TOLGEE_API_REQUEST',
      replyType: 'TOLGEE_API_RESPONSE',
      timeoutMs: 1_000,
    });
    await settle();
    r.answer('TOLGEE_API_RESPONSE', { id: r.sent[0].data.id, response: {} });
    await first;

    answerPings = false;
    await expect(
      rpc.requestFromExtension({
        type: 'TOLGEE_API_REQUEST',
        replyType: 'TOLGEE_API_RESPONSE',
        timeoutMs: 100,
      })
    ).rejects.toMatchObject({ kind: 'unavailable' });
    expect(r.sent).toHaveLength(2);

    const pingsBefore = pings.length;
    jest.useFakeTimers();
    try {
      const third = rpc.requestFromExtension({
        type: 'TOLGEE_API_REQUEST',
        replyType: 'TOLGEE_API_RESPONSE',
      });
      const outcome = third.then(
        () => 'resolved',
        () => 'rejected'
      );
      await jest.advanceTimersByTimeAsync(rpc.RELAY_DISCOVERY_TIMEOUT_MS + 500);
      expect(await outcome).toBe('rejected');
      expect(pings.length).toBeGreaterThan(pingsBefore);
      expect(r.sent).toHaveLength(2);
    } finally {
      jest.useRealTimers();
    }
  });

  it('ignores a reply of another type for the same id', async () => {
    const promise = rpc.requestFromExtension({
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
    const promise = rpc.uploadScreenshotViaExtension(() =>
      events.push('captured')
    );
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
    const promise = rpc.uploadScreenshotViaExtension(onCaptured);
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
