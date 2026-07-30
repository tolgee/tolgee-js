import { Subscription, Handler, ListenerEvent } from '../../types';

export const EventEmitter = <Event extends ListenerEvent<string, any>>(
  type: Event['type'],
  isActive: () => boolean
): EventEmitterInstance<Event> => {
  const handlers = new Set<Handler<Event>>();

  return {
    listen(handler: (e: Event) => void): Subscription {
      const handlerWrapper: Handler<Event> = (e) => {
        handler(e);
      };

      handlers.add(handlerWrapper);

      return {
        unsubscribe() {
          handlers.delete(handlerWrapper);
        },
      };
    },
    emit(data: Event['value']) {
      if (isActive()) {
        // snapshot, so subscriptions changed by a handler don't affect this emit
        Array.from(handlers).forEach((handler) =>
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
          handler: Handler<ListenerEvent<E, T>>
        ) => Subscription;
        readonly emit: (data: T) => void;
      }
    : never;
