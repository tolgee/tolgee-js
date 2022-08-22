type HandlerType<T> = (data: T) => void;
type HandlerWrapperType<T> = {
  fn: HandlerType<T>;
  keys: Set<string>;
};

export const EventEmitterSelective = <T>() => {
  let handlers: HandlerWrapperType<T>[] = [];

  const listen = (handler: HandlerType<T>) => {
    const handlerWrapper = {
      fn: (data: T) => {
        handler(data);
      },
      keys: new Set<string>(),
    };

    handlers.push(handlerWrapper);

    const result = {
      unsubscribe: () => {
        handlers = handlers.filter((i) => handlerWrapper !== i);
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
    handlers.forEach((handler) => {
      if (!key || handler.keys.has(key)) {
        handler.fn(data);
      }
    });
  };

  return Object.freeze({ listen, emit });
};

export type EventEmitterSelectiveType = ReturnType<
  typeof EventEmitterSelective
>;
