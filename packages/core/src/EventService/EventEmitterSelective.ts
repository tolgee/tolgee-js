type HandlerType<T> = (data: T) => void;
type HandlerWrapperType<T> = {
  fn: HandlerType<T>;
  keys: Set<string>;
};

export const EventEmitterSelective = <T>() => {
  const listeners: Set<HandlerType<T>> = new Set();
  const partialListeners: Set<HandlerWrapperType<T>> = new Set();

  const listen = (handler: HandlerType<T>) => {
    listeners.add(handler);
    const result = {
      unsubscribe: () => {
        listeners.delete(handler);
      },
    };
    return result;
  };

  const listenSome = (handler: HandlerType<T>) => {
    const handlerWrapper = {
      fn: (data: T) => {
        handler(data);
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
      handler(data);
    });
    partialListeners.forEach((handler) => {
      if (!key || handler.keys.has(key)) {
        handler.fn(data);
      }
    });
  };

  return Object.freeze({ listenSome, listen, emit });
};

export type EventEmitterSelectiveType<T> = ReturnType<
  typeof EventEmitterSelective<T>
>;
