import { Subscription, ListenerEvent, CombinedHandler } from '../../types';

export function EventEmitterCombined<E extends ListenerEvent<string, any>>(
  isActive: () => boolean
): EventEmitterCombinedInstance<E> {
  const handlers = new Set<CombinedHandler<E>>();

  let queue: E[] = [];

  // merge events in queue into one event
  function solveQueue() {
    if (queue.length === 0) {
      return;
    }
    const queueCopy = queue;
    queue = [];
    // snapshot, so subscriptions changed by a handler don't affect this emit
    Array.from(handlers).forEach((handler) => {
      handler(queueCopy);
    });
  }

  return Object.freeze({
    listen(handler: (e: E[]) => void): Subscription {
      const handlerWrapper: CombinedHandler<E> = (events) => {
        handler(events);
      };

      handlers.add(handlerWrapper);

      return {
        unsubscribe() {
          handlers.delete(handlerWrapper);
        },
      };
    },
    emit(e: E, delayed: boolean) {
      if (isActive()) {
        if (isActive()) {
          queue.push(e);
          if (!delayed) {
            solveQueue();
          } else {
            setTimeout(solveQueue, 0);
          }
        }
      }
    },
  });
}

export type EventEmitterCombinedInstance<E extends ListenerEvent<string, any>> =
  {
    readonly listen: (handler: CombinedHandler<E>) => Subscription;
    readonly emit: (e: E, delayed: boolean) => void;
  };
