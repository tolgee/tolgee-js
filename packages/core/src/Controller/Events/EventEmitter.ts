import { Subscription, Listener, ListenerEvent } from '../../types';

export const EventEmitter = <Event extends ListenerEvent<string, any>>(
  type: Event['type'],
  isActive: () => boolean
): EventEmitterInstance<Event> => {
  let handlers: Listener<Event>[] = [];

  return {
    listen(handler: (e: Event) => void): Subscription {
      const handlerWrapper: Listener<Event> = (e) => {
        handler(e);
      };

      handlers.push(handlerWrapper);

      return {
        unsubscribe() {
          handlers = handlers.filter((i) => handlerWrapper !== i);
        },
      };
    },
    emit(data: Event['value']) {
      if (isActive()) {
        handlers.forEach((handler) =>
          handler({ type: type, value: data } as Event)
        );
      }
    },
  } as unknown as EventEmitterInstance<Event>;
};

export type EventEmitterInstance<Event> =
  Event extends ListenerEvent<infer E, infer T>
    ? {
        readonly listen: (
          handler: Listener<ListenerEvent<E, T>>
        ) => Subscription;
        readonly emit: (data: T) => void;
      }
    : never;
