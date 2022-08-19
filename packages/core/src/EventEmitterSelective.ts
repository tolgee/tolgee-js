type HandlerType<T> = (data: T) => void;
type HandlerWrapperType<T> = {
  fn: HandlerType<T>;
  key: string;
};

export const EventEmitterSelective = <T>() => {
  let handlers: HandlerWrapperType<T>[] = [];

  const listen = (key: string, handler: HandlerType<T>) => {
    const handlerWrapper = {
      fn: (data: T) => {
        handler(data);
      },
      key,
    };

    handlers.push(handlerWrapper);

    return {
      unsubscribe: () => {
        handlers = handlers.filter((i) => handlerWrapper !== i);
      },
    };
  };

  const emit = (data: T, key?: string) => {
    handlers.forEach((handler) => {
      if (!key || handler.key === handler.key) {
        handler.fn(data);
      }
    });
  };

  return Object.freeze({ listen, emit });
};

export type EventEmitterSelectiveType = ReturnType<
  typeof EventEmitterSelective
>;
