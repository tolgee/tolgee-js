import { Listener, ListenerHandler } from '../types';

export const EventEmitter = <T>() => {
  let handlers: ListenerHandler<T>[] = [];

  const listen = (handler: ListenerHandler<T>): Listener => {
    const handlerWrapper: ListenerHandler<T> = (e) => {
      handler(e);
    };

    handlers.push(handlerWrapper);

    return {
      unsubscribe: () => {
        handlers = handlers.filter((i) => handlerWrapper !== i);
      },
    };
  };

  const emit = (data: T) => {
    handlers.forEach((handler) => handler({ value: data }));
  };

  return Object.freeze({ listen, emit });
};

export type EventEmitterType<T> = ReturnType<typeof EventEmitter<T>>;
