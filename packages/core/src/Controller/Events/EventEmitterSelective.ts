import { getFallbackArray } from '../State/helpers';
import {
  FallbackNsTranslation,
  KeyDescriptor,
  KeyDescriptorInternal,
  Listener,
  ListenerHandler,
  ListenerHandlerEvent,
  ListenerSelective,
  NsType,
} from '../../types';

const DEFAULT_NS = 0;
const FALLBACK_NS = 1;

type NsListType = string | typeof DEFAULT_NS | typeof FALLBACK_NS;

type HandlerWrapperType = {
  fn: ListenerHandler<undefined>;
  keys: Set<string>;
  namespaces: Set<NsListType>;
};

export const EventEmitterSelective = (
  getFallbackNs: () => string[],
  getDefaultNs: () => string
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
      keys: new Set<string>(),
      namespaces: new Set<NsListType>(),
    };

    partialListeners.add(handlerWrapper);

    const result = {
      unsubscribe: () => {
        partialListeners.delete(handlerWrapper);
      },
      subscribeNs: (ns: FallbackNsTranslation) => {
        getFallbackArray(ns).forEach((val) =>
          handlerWrapper.namespaces.add(val)
        );
        if (ns === undefined) {
          // subscribing to default ns
          handlerWrapper.namespaces.add(DEFAULT_NS);
        }

        return result;
      },
      subscribeKey: (descriptor: KeyDescriptor) => {
        const { key, ns } = descriptor;
        handlerWrapper.keys.add(key);
        getFallbackArray(ns).forEach((val) =>
          handlerWrapper.namespaces.add(val)
        );

        if (ns === undefined) {
          // subscribing to default ns
          handlerWrapper.namespaces.add(DEFAULT_NS);
        }
        // always subscribe to fallback namespaces
        handlerWrapper.namespaces.add(FALLBACK_NS);
        return result;
      },
    };

    return result;
  };

  const namespacesWithFallbacks = (
    namespaces: Map<NsListType, number> | Set<NsListType>
  ) => {
    if (namespaces.has(FALLBACK_NS) || namespaces.has(DEFAULT_NS)) {
      const result = new Set(namespaces.keys());
      if (namespaces.has(FALLBACK_NS)) {
        result.delete(FALLBACK_NS);
        getFallbackNs().forEach((ns) => result.add(ns));
      }
      if (namespaces.has(DEFAULT_NS)) {
        result.delete(DEFAULT_NS);
        result.add(getDefaultNs());
      }
      return result as Set<string>;
    }
    return namespaces as Map<string, number>;
  };

  const callHandlers = (
    key: string | undefined,
    ns: Array<string> | undefined
  ) => {
    partialListeners.forEach((handler) => {
      const handlerNamespaces = namespacesWithFallbacks(handler.namespaces);
      const nsMatches =
        ns === undefined ||
        ns?.findIndex((ns) => handlerNamespaces.has(ns!)) !== -1;
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

    let namespaces: Set<NsType> | undefined = new Set<NsType>();
    let keys: Set<string> | undefined = new Set<string>();
    queue.forEach((descriptor) => {
      if (descriptor?.ns === undefined) {
        // when no ns specified, it affects all namespaces
        namespaces = undefined;
      } else if (namespaces !== undefined) {
        descriptor.ns.forEach((ns) => namespaces!.add(ns));
      }
      if (descriptor?.key === undefined) {
        // when no key specified, it affects all keys
        keys = undefined;
      } else if (keys !== undefined) {
        keys.add(descriptor.key);
      }
    });
    const namespacesArray = namespaces
      ? Array.from(namespaces.keys())
      : undefined;
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
      setTimeout(solveQueue, 0);
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
