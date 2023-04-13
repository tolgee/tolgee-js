import { getFallbackArray } from '../../helpers';
import {
  NsFallback,
  Subscription,
  Listener,
  ListenerEvent,
  SubscriptionSelective,
  NsType,
} from '../../types';

type NsListType = string;

type HandlerWrapperType = {
  fn: Listener<undefined>;
  namespaces: Set<string>;
};

export function EventEmitterSelective(
  isActive: () => boolean,
  getFallbackNs: () => string[],
  getDefaultNs: () => string
): EventEmitterSelectiveInstance {
  const listeners: Set<Listener<undefined>> = new Set();
  const partialListeners: Set<HandlerWrapperType> = new Set();

  function callHandlers(ns: Array<string> | undefined) {
    // everything is implicitly subscribed to fallbacks
    // as it can always fall through to it
    const fallbackNamespaces = new Set(getFallbackNs());

    partialListeners.forEach((handler) => {
      const nsMatches =
        ns === undefined ||
        ns?.findIndex(
          (ns) => fallbackNamespaces.has(ns) || handler.namespaces.has(ns!)
        ) !== -1;

      if (nsMatches) {
        handler.fn({ value: undefined as any });
      }
    });
  }

  let queue: (string[] | undefined)[] = [];

  // merge events in queue into one event
  function solveQueue() {
    if (queue.length === 0) {
      return;
    }
    const queueCopy = queue;
    queue = [];

    listeners.forEach((handler) => {
      handler({ value: undefined as any });
    });

    let namespaces: Set<NsType> | undefined = new Set<NsType>();

    queueCopy.forEach((ns) => {
      if (ns === undefined) {
        // when no ns specified, it affects all namespaces
        namespaces = undefined;
      } else if (namespaces !== undefined) {
        ns.forEach((ns) => namespaces!.add(ns));
      }
    });

    const namespacesArray = namespaces
      ? Array.from(namespaces.keys())
      : undefined;

    callHandlers(namespacesArray);
  }

  return Object.freeze({
    emit(ns?: string[], delayed?: boolean) {
      if (isActive()) {
        queue.push(ns);
        if (!delayed) {
          solveQueue();
        } else {
          setTimeout(solveQueue, 0);
        }
      }
    },

    listen(handler: Listener<undefined>) {
      listeners.add(handler);
      const result = {
        unsubscribe: () => {
          listeners.delete(handler);
        },
      };
      return result;
    },

    listenSome(handler: Listener<undefined>) {
      const handlerWrapper = {
        fn: (e: ListenerEvent<undefined>) => {
          handler(e);
        },
        namespaces: new Set<NsListType>(),
      };

      partialListeners.add(handlerWrapper);

      const result = {
        unsubscribe: () => {
          partialListeners.delete(handlerWrapper);
        },
        subscribeNs: (ns: NsFallback) => {
          getFallbackArray(ns).forEach((val) =>
            handlerWrapper.namespaces.add(val)
          );
          if (ns === undefined) {
            // subscribing to default ns
            handlerWrapper.namespaces.add(getDefaultNs());
          }
          return result;
        },
      };

      return result;
    },
  });
}

export type EventEmitterSelectiveInstance = {
  readonly listenSome: (handler: Listener<undefined>) => SubscriptionSelective;
  readonly listen: (handler: Listener<undefined>) => Subscription;
  readonly emit: (ns?: string[], delayed?: boolean) => void;
};
