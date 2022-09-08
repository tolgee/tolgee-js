import { ListenerHandler, ListenerHandlerEvent } from '../types';

type HandlerWrapperType<T> = {
  fn: ListenerHandler<T>;
  keys: Set<string>;
};

export const EventEmitterSelective = <T>() => {
  const listeners: Set<ListenerHandler<T>> = new Set();
  const partialListeners: Set<HandlerWrapperType<T>> = new Set();

  const listen = (handler: ListenerHandler<T>) => {
    listeners.add(handler);
    const result = {
      unsubscribe: () => {
        listeners.delete(handler);
      },
    };
    return result;
  };

  const listenSome = (handler: ListenerHandler<T>) => {
    const handlerWrapper = {
      fn: (e: ListenerHandlerEvent<T>) => {
        handler(e);
      },
      keys: new Set<string>(),
    };

    partialListeners.add(handlerWrapper);

    const result = {
      unsubscribe: () => {
        partialListeners.delete(handlerWrapper);
      },
      subscribeToKey: (key: string) => {
        handlerWrapper.keys.add(key);
        return result;
      },
      unsubscribeKey: (key: string) => {
        handlerWrapper.keys.delete(key);
        return result;
      },
    };

    return result;
  };

  const emit = (data: T, key?: string) => {
    listeners.forEach((handler) => {
      handler({ value: data });
    });
    partialListeners.forEach((handler) => {
      if (!key || handler.keys.has(key)) {
        handler.fn({ value: data });
      }
    });
  };

  return Object.freeze({ listenSome, listen, emit });
};

export type EventEmitterSelectiveType<T> = ReturnType<
  typeof EventEmitterSelective<T>
>;
