import { sleep } from '../ui/tools/sleep';
import {
  detectExtension,
  Handshaker,
  sendAndRecieve,
  takeScreenshot,
} from './extension';

describe('communicates with extension correctly', () => {
  let registerListener = jest.fn();
  let postMessageMock = jest.fn();
  beforeEach(() => {
    registerListener = jest.fn();
    window.addEventListener = jest.fn((_, listener) =>
      registerListener(listener)
    );
    window.removeEventListener = jest.fn();

    postMessageMock = jest.fn();
    window.postMessage = postMessageMock;

    // @ts-ignore
    window.setTimeout = jest.fn((callback) =>
      Promise.resolve().then(() => callback())
    );
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends correct message', async () => {
    const { promise } = sendAndRecieve({
      message: 'PING',
      recievingMessage: ['PONG'],
      data: 'testData',
    });
    registerListener.mock.calls[0][0]({
      data: { type: 'PONG', data: 'resultData' },
    });
    const result = await promise;
    expect(result).toEqual('resultData');
    expect(postMessageMock.mock.calls[0][0]).toEqual({
      type: 'PING',
      data: 'testData',
    });
  });

  it('repeats message correctly', async () => {
    const { promise } = sendAndRecieve({
      message: 'PING',
      recievingMessage: ['PONG'],
      data: 'testData',
      attempts: 7,
    });
    const result = await promise.catch(() => 'error');
    expect(postMessageMock).toBeCalledTimes(7);
    expect(result).toEqual('error');
  });

  it('cancels repetition', async () => {
    const { promise, cancel } = sendAndRecieve({
      message: 'PAT',
      recievingMessage: ['MAT'],
      data: 'testData',
      attempts: 7,
    });
    promise.catch(() => 'error');
    cancel();
    await sleep(10);
    expect(postMessageMock).toBeCalledTimes(1);
  });

  it('ping detects if extension is present', async () => {
    const promise = detectExtension();
    expect(postMessageMock.mock.calls[0][0].type).toEqual('TOLGEE_PING');
    registerListener.mock.calls[0][0]({
      data: { type: 'TOLGEE_PONG', data: undefined },
    });
    const result = await promise;
    expect(result).toEqual(true);
    expect(registerListener).toBeCalled();
    expect(window.removeEventListener).toBeCalled();
  });

  it('ping timeouts if extension is not present', async () => {
    const result = await detectExtension();
    expect(result).toEqual(false);
    expect(postMessageMock).toBeCalledTimes(2);
  });

  it('take screenshot works', async () => {
    const promise = takeScreenshot();
    registerListener.mock.calls[0][0]({
      data: { type: 'TOLGEE_SCREENSHOT_TAKEN', data: 'test' },
    });

    const result = await promise;
    expect(result).toEqual('test');
  });

  it('take screenshot throws error', async () => {
    const result = await takeScreenshot().catch(() => 'error');
    expect(result).toEqual('error');
  });

  ['TOLGEE_PLUGIN_READY', 'TOLGEE_PLUGIN_UPDATED'].forEach((event) => {
    it(`handshaker works with ${event}`, async () => {
      const handshaker = Handshaker();
      const promise = handshaker.update({
        uiPresent: false,
        mode: 'production',
        config: {
          apiUrl: 'test',
          apiKey: 'test',
        },
      });
      expect(registerListener).toBeCalled();

      registerListener.mock.calls[0][0]({
        data: { type: event, data: true },
      });

      const result = await promise;

      expect(result).toEqual(true);
    });
  });

  it('handshaker throws error if extension not present', async () => {
    const handshaker = Handshaker();
    const promise = handshaker.update({
      uiPresent: false,
      mode: 'production',
      config: {
        apiUrl: 'test',
        apiKey: 'test',
      },
    });

    const result = await promise.catch(() => 'error');
    expect(result).toEqual('error');
  });

  it('handshaker will send only the last message', async () => {
    const handshaker = Handshaker();
    handshaker.update('first message' as any);
    await handshaker.update('second message' as any).catch(() => 'error');
    expect(
      postMessageMock.mock.calls.filter(
        (args) => args[0].data === 'first message'
      )
    ).toHaveLength(1);
    expect(
      postMessageMock.mock.calls.filter(
        (args) => args[0].data === 'second message'
      )
    ).toHaveLength(4);
  });
});
