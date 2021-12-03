jest.dontMock('./Messages');
jest.dontMock('../services/DependencyService');

import { Messages } from './Messages';
import { DependencyService } from '../services/DependencyService';

describe('Messages', () => {
  let messages: Messages;
  let windowAddEventListenerSpy;
  let windowRemoveEventListenerSpy;

  beforeEach(async () => {
    messages = new DependencyService().messages;
    windowAddEventListenerSpy = jest.spyOn(window, 'addEventListener');
    windowRemoveEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    messages.startListening();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Can be created', () => {
    expect(messages).toBeInstanceOf(Messages);
  });

  describe('starListening method', () => {
    test('adds event listener to window', () => {
      expect(windowAddEventListenerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('listening', () => {
    let resolve;
    const promise = new Promise((r) => (resolve = r));
    const callbackMock = jest.fn(() => {
      resolve();
    });
    const data = {};
    let removeListener;
    const sendMessage = () =>
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'TEST_EVENT', data },
          source: window,
          origin: window.origin,
        })
      );

    beforeEach(async () => {
      removeListener = messages.listen('TEST_EVENT', callbackMock);
      sendMessage();
      await promise;
    });

    test('listens to event', async () => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(data);
    });

    test('returns callback to remove listener', () => {
      expect((messages as any).listeners).toHaveLength(1);
      removeListener();
      expect((messages as any).listeners).toHaveLength(0);
    });
  });

  describe('stopListening method', () => {
    test('stopsListening', () => {
      messages.stopListening();
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
        windowAddEventListenerSpy.mock.calls[0][0],
        windowAddEventListenerSpy.mock.calls[0][1],
        windowAddEventListenerSpy.mock.calls[0][2]
      );
    });
  });
});
