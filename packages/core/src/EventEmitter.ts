type HandlerType<T> = (data: T) => void;

export const EventEmitter = <T>() => {
  let handlers: HandlerType<T>[] = [];

  const listen = (handler: HandlerType<T>) => {
    const handlerWrapper: HandlerType<T> = (data) => {
      handler(data);
    };

    handlers.push(handlerWrapper);

    return {
      unsubscribe: () => {
        handlers = handlers.filter((i) => handlerWrapper !== i);
      },
    };
  };

  const emit = (data: T) => {
    handlers.forEach((handler) => handler(data));
  };

  return Object.freeze({ listen, emit });
};

export type EventEmitterType = ReturnType<typeof EventEmitter>;
