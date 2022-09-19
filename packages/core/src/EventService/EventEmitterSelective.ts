import { getFallbackArray } from '../StateService/State/helpers';
import {
  FallbackNSTranslation,
  KeyDescriptor,
  KeyDescriptorInternal,
  ListenerHandler,
  ListenerHandlerEvent,
} from '../types';

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

export const EventEmitterSelective = <T>() => {
  const listeners: Set<ListenerHandler<T>> = new Set();
  const partialListeners: Set<HandlerWrapperType> = new Set();

  const listen = (handler: ListenerHandler<T>) => {
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

  const callHandlers = (key: string | undefined, ns: string[] | undefined) => {
    partialListeners.forEach((handler) => {
      const nsMentioned = ns !== undefined;
      const nsMatches =
        handler.namespaces.has(undefined) ||
        ns?.findIndex((ns) => handler.namespaces.has(ns)) !== -1;
      const keyMentioned = key !== undefined;
      const keyMatches =
        key === undefined || handler.keys.has(key) || handler.keys.size === 0;
      if ((!nsMentioned || nsMatches) && (!keyMentioned || keyMatches)) {
        handler.fn({ value: undefined as any });
      }
    });
  };

  let queue: (KeyDescriptorInternal | undefined)[] = [];
  const solveQueue = () => {
    if (queue.length === 0) {
      return;
    }
    listeners.forEach((handler) => {
      handler({ value: undefined as any });
    });

    let namespaces = [] as string[] | undefined;
    let keys = [] as string[] | undefined;
    queue.forEach((descriptor) => {
      if (descriptor?.ns === undefined) {
        namespaces = undefined;
      } else if (namespaces !== undefined) {
        namespaces = [...namespaces, ...descriptor.ns];
      }
      if (descriptor?.key === undefined) {
        keys = undefined;
      } else if (keys !== undefined) {
        keys = [...keys, descriptor.key];
      }
    });
    (keys || [undefined]).forEach((key) => {
      callHandlers(key, namespaces);
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

export type EventEmitterSelectiveType<T> = ReturnType<
  typeof EventEmitterSelective<T>
>;
