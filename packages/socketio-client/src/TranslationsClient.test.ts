jest.dontMock('./TranslationsClient');
jest.mock('socket.io-client');

import { TranslationsClient } from './TranslationsClient';
import io from 'socket.io-client';
import { mocked } from 'ts-jest/utils';

describe('TranslationsClient', () => {
  const authentication = {
    apiKey: 'dummy_api_key',
  };

  const socketOnMock = jest.fn();
  const socketOffMock = jest.fn();
  const socketDisconnectMock = jest.fn();

  let client: TranslationsClient;

  beforeEach(() => {
    jest.resetAllMocks();
    mocked(io).mockReturnValue({
      on: socketOnMock,
      off: socketOffMock,
      disconnect: socketDisconnectMock,
    } as any);

    client = new TranslationsClient({
      serverUrl: 'dummy_server_url',
      authentication,
    });
  });

  it('creates socket automatically', () => {
    client.on('connect', () => {});
    expect(io).toBeCalledWith('dummy_server_url/translations', {
      query: authentication,
    });
    expect(io).toHaveBeenCalledTimes(1);
  });

  it('listens to event', () => {
    const fn = jest.fn();
    client.on('connect', fn);
    expect(socketOnMock).toBeCalledWith('connect', fn);
    expect(socketOnMock).toBeCalledTimes(1);
  });

  it('unsubscribes', () => {
    const fn = jest.fn();
    const unsubscribe = client.on('connect', fn);
    unsubscribe();
    expect(socketOffMock).toHaveBeenCalledTimes(1);
  });

  it('disconnects', () => {
    client.disconnect();
    expect(socketDisconnectMock).not.toHaveBeenCalled();
    const fn = jest.fn();
    client.on('reconnect_attempt', fn);
    client.disconnect();
    expect(socketDisconnectMock).toHaveBeenCalled();
  });
});
