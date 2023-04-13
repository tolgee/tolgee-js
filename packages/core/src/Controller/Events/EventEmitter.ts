import { Subscription, Listener } from '../../types';

export function EventEmitter<T>(
  isActive: () => boolean
): EventEmitterInstance<T> {
  let handlers: Listener<T>[] = [];

  return Object.freeze({
    listen(handler: Listener<T>): Subscription {
      const handlerWrapper: Listener<T> = (e) => {
        handler(e);
      };

      handlers.push(handlerWrapper);

      return {
        unsubscribe() {
          handlers = handlers.filter((i) => handlerWrapper !== i);
        },
      };
    },
    emit(data: T) {
      if (isActive()) {
        handlers.forEach((handler) => handler({ value: data }));
      }
    },
  });
}

export type EventEmitterInstance<T> = {
  readonly listen: (handler: Listener<T>) => Subscription;
  readonly emit: (data: T) => void;
};
