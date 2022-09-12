import { getFallback } from '../StateService/State/helpers';
import {
  KeyDescriptor,
  KeyDescriptorInternal,
  ListenerHandler,
  ListenerHandlerEvent,
} from '../types';

type HandlerWrapperType<T> = {
  fn: ListenerHandler<T>;
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
  const partialListeners: Set<HandlerWrapperType<T>> = new Set();

  const listen = (handler: ListenerHandler<T>) => {
    listeners.add(handler);
    const result = {
      unsubscribe: () => {
        listeners.delete(handler);
      },
    };
    return result;
  };

  const listenSome = (handler: ListenerHandler<T>) => {
    const handlerWrapper = {
      fn: (e: ListenerHandlerEvent<T>) => {
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
      subscribeToKey: (descriptor: KeyDescriptor) => {
        const { key, ns } = descriptor;
        incrementInMap(handlerWrapper.keys, key);
        getFallback(ns).forEach((val) =>
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
        getFallback(ns).forEach((val) =>
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

  const emit = (data: T, descriptor?: KeyDescriptorInternal) => {
    listeners.forEach((handler) => {
      handler({ value: data });
    });
    partialListeners.forEach((handler) => {
      const nsMentioned = descriptor?.ns !== undefined;
      const nsMatches =
        handler.namespaces.has(undefined) ||
        descriptor?.ns?.findIndex((ns) => handler.namespaces.has(ns)) !== -1;
      const keyMentioned = descriptor?.key !== undefined;
      const keyMatches = descriptor?.key && handler.keys.has(descriptor.key);
      if ((!nsMentioned || nsMatches) && (!keyMentioned || keyMatches)) {
        handler.fn({ value: data });
      }
    });
  };

  return Object.freeze({ listenSome, listen, emit });
};

export type EventEmitterSelectiveType<T> = ReturnType<
  typeof EventEmitterSelective<T>
>;
