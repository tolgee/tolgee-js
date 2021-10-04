type Listener = {
  type: string;
  callback: (data) => void;
};

type Message = {
  data: any;
  type: string;
};

type TolgeeEvent = {
  data: Message;
} & MessageEvent;

export class Messages {
  private listeners: Listener[] = [];
  private _stopListening: () => void;

  readonly startListening = () => {
    const receiveMessage = (event: TolgeeEvent) => {
      if (event.source != window) {
        return;
      }
      this.listeners.forEach((listener) => {
        if (listener.type == event.data.type) {
          listener.callback(event.data.data);
        }
      });
    };

    window.addEventListener('message', receiveMessage, false);

    typeof this._stopListening === 'function' && this._stopListening();
    this._stopListening = () => {
      window.removeEventListener('message', receiveMessage, false);
    };
  };

  public stopListening() {
    this._stopListening();
  }

  readonly listen = (type: string, callback: (data) => void) => {
    const listenerInfo = { type, callback };
    this.listeners.push(listenerInfo);
    // return callback to remove the listener
    return () => {
      this.listeners.splice(this.listeners.indexOf(listenerInfo), 1);
    };
  };

  readonly send = (type: string, data?: any) => {
    try {
      window.postMessage({ type, data }, window.origin);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Cannot send message.', e);
    }
  };
}
