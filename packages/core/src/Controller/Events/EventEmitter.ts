import { Subscription, Listener } from '../../types';

export const EventEmitter = <T>(
  isActive: () => boolean
): EventEmitterInstance<T> => {
  let handlers: Listener<T>[] = [];

  const listen = (handler: Listener<T>): Subscription => {
    const handlerWrapper: Listener<T> = (e) => {
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
    if (isActive()) {
      handlers.forEach((handler) => handler({ value: data }));
    }
  };

  return Object.freeze({ listen, emit });
};

export type EventEmitterInstance<T> = {
  readonly listen: (handler: Listener<T>) => Subscription;
  readonly emit: (data: T) => void;
};
