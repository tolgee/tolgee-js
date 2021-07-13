import { Events, EventType } from './events';
import io from 'socket.io-client';

type TranslationsClientOptions = {
  serverUrl: string;
  transports?: ('websocket' | 'polling')[];
  authentication:
    | {
        jwtToken: string;
        projectId: number;
      }
    | {
        apiKey: string;
      };
};

const TRANSLATIONS_CHANNEL_NAME = 'translations';

export class TranslationsClient {
  constructor(private options: TranslationsClientOptions) {
    options.serverUrl = options.serverUrl || 'https://socket.app.tolgee.io';
  }

  private _socket?: SocketIOClient.Socket;
  private get socket(): SocketIOClient.Socket {
    if (this._socket === undefined) {
      this._socket = io(
        `${this.options.serverUrl}/${TRANSLATIONS_CHANNEL_NAME}`,
        {
          transports: this.options.transports || ['websocket'],
          query: this.options.authentication,
        }
      );
    }
    return this._socket;
  }

  /**
   * Subscribes to an event
   * @param event Name of event
   * @param callback Callback function to be executed when event is triggered
   * @return Function Function unsubscribing the event listening
   */
  on<T extends EventType>(
    event: T,
    callback: (data: Events[T]) => void
  ): () => void {
    this.socket.on(event, callback);
    return () => this.socket.off(event, callback);
  }

  disconnect() {
    if (this._socket) {
      this.socket.disconnect();
      this._socket = undefined;
    }
  }
}
