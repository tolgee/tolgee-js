import { getFallbackArray } from '../State/helpers';
import {
  FallbackNSTranslation,
  KeyDescriptor,
  KeyDescriptorInternal,
  Listener,
  ListenerHandler,
  ListenerHandlerEvent,
  ListenerSelective,
} from '../../types';

type HandlerWrapperType = {
  fn: ListenerHandler<undefined>;
  keys: Map<string, number>;
  namespaces: Map<string | undefined, number>;
};

function incrementInMap(map: Map<any, number>, value: any) {
  const currNum = map.get(value) || 0;
  map.set(value, currNum + 1);
}

function decrementInMap(map: Map<any, number>, value: any) {
  let currNum = map.get(value) || 1;
  currNum -= 1;
  if (currNum <= 0) {
    map.delete(value);
  } else {
    map.set(value, currNum);
  }
}

export const EventEmitterSelective = (
  getFallbackNamespaces: () => string[]
): EventEmitterSelectiveInstance => {
  const listeners: Set<ListenerHandler<undefined>> = new Set();
  const partialListeners: Set<HandlerWrapperType> = new Set();

  const listen = (handler: ListenerHandler<undefined>) => {
    listeners.add(handler);
    const result = {
      unsubscribe: () => {
        listeners.delete(handler);
      },
    };
    return result;
  };

  const listenSome = (handler: ListenerHandler<undefined>) => {
    const handlerWrapper = {
      fn: (e: ListenerHandlerEvent<undefined>) => {
        handler(e);
      },
      keys: new Map<string, number>(),
      namespaces: new Map<string | undefined, number>(),
    };

    partialListeners.add(handlerWrapper);

    const result = {
      unsubscribe: () => {
        partialListeners.delete(handlerWrapper);
      },
      subscribeNs: (ns: FallbackNSTranslation) => {
        getFallbackArray(ns).forEach((val) =>
          incrementInMap(handlerWrapper.namespaces, val)
        );
        return result;
      },
      unsubscribeNs: (ns: FallbackNSTranslation) => {
        getFallbackArray(ns).forEach((val) =>
          decrementInMap(handlerWrapper.namespaces, val)
        );
        return result;
      },
      subscribeKey: (descriptor: KeyDescriptor) => {
        const { key, ns } = descriptor;
        incrementInMap(handlerWrapper.keys, key);
        getFallbackArray(ns).forEach((val) =>
          incrementInMap(handlerWrapper.namespaces, val)
        );
        if (ns === undefined) {
          // subscribing to all namespaces
          incrementInMap(handlerWrapper.namespaces, undefined);
        }
        return result;
      },
      unsubscribeKey: (descriptor: KeyDescriptor) => {
        const { key, ns } = descriptor;
        decrementInMap(handlerWrapper.keys, key);
        getFallbackArray(ns).forEach((val) =>
          decrementInMap(handlerWrapper.namespaces, val)
        );
        if (ns === undefined) {
          // subscribing to all namespaces
          decrementInMap(handlerWrapper.namespaces, undefined);
        }
        return result;
      },
    };

    return result;
  };

  const namespacesWithFallbacks = (
    namespaces: Map<string | undefined, number> | Set<string | undefined>
  ) => {
    if (namespaces.has(undefined)) {
      const result = new Set(namespaces.keys());
      result.delete(undefined);
      getFallbackNamespaces().forEach((ns) => result.add(ns));
      return result as Set<string>;
    }
    return namespaces as Map<string, number>;
  };

  const callHandlers = (key: string | undefined, ns: string[] | undefined) => {
    partialListeners.forEach((handler) => {
      const handlerNamespaces = namespacesWithFallbacks(handler.namespaces);
      const nsMatches =
        ns === undefined ||
        ns?.findIndex((ns) => handlerNamespaces.has(ns)) !== -1;
      const keyMatches =
        key === undefined || handler.keys.has(key) || handler.keys.size === 0;
      if (nsMatches && keyMatches) {
        handler.fn({ value: undefined as any });
      }
    });
  };

  let queue: (KeyDescriptorInternal | undefined)[] = [];
  // merge events in queue into one event
  const solveQueue = () => {
    if (queue.length === 0) {
      return;
    }
    listeners.forEach((handler) => {
      handler({ value: undefined as any });
    });

    const namespaces = new Set<string | undefined>();
    let keys: Set<string> | undefined = new Set<string>();
    queue.forEach((descriptor) => {
      if (descriptor?.ns === undefined) {
        // when no ns specified, it affets all fallback namespaces
        namespaces.add(undefined);
      } else {
        descriptor.ns.forEach((ns) => namespaces.add(ns));
      }
      if (descriptor?.key === undefined) {
        // when no key specified, it affects all keys
        keys = undefined;
      } else if (keys !== undefined) {
        keys.add(descriptor.key);
      }
    });
    const namespacesArray = Array.from(
      namespacesWithFallbacks(namespaces).keys()
    );
    (keys || [undefined]).forEach((key) => {
      callHandlers(key, namespacesArray);
    });
    queue = [];
  };
  const emit = (descriptor?: KeyDescriptorInternal, delayed?: boolean) => {
    queue.push(descriptor);
    if (!delayed) {
      solveQueue();
    } else {
      Promise.resolve().then(() => {
        solveQueue();
      });
    }
  };

  return Object.freeze({ listenSome, listen, emit });
};

export type EventEmitterSelectiveInstance = {
  readonly listenSome: (
    handler: ListenerHandler<undefined>
  ) => ListenerSelective;
  readonly listen: (handler: ListenerHandler<undefined>) => Listener;
  readonly emit: (
    descriptor?: KeyDescriptorInternal,
    delayed?: boolean
  ) => void;
};
