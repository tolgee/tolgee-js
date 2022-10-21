import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ListenerSelective,
  KeyDescriptor,
  TranslateProps,
  FallbackNsTranslation,
  getFallbackArray,
  getFallback,
} from '@tolgee/web';

import { useTolgeeContext } from './useTolgeeContext';
import { ReactOptions } from './types';

export const useTranslateInternal = (
  ns?: FallbackNsTranslation,
  options?: ReactOptions
) => {
  const { tolgee, options: defaultOptions } = useTolgeeContext();
  const namespaces = getFallback(ns);
  const namespacesJoined = getFallbackArray(namespaces).join(':');

  const currentOptions = {
    ...defaultOptions,
    ...options,
  };

  // dummy state to enable re-rendering
  const [instance, setInstance] = useState(0);

  const forceRerender = useCallback(() => {
    setInstance((v) => v + 1);
  }, [setInstance]);

  const subscriptionRef = useRef<ListenerSelective>();

  const subscriptionQueue = useRef([] as KeyDescriptor[]);
  subscriptionQueue.current = [];

  const subscribeToKey = (key: KeyDescriptor) => {
    subscriptionQueue.current.push(key);
    subscriptionRef.current?.subscribeKey(key);
  };

  const isLoaded = tolgee.isLoaded(namespaces);

  useEffect(() => {
    const subscription = tolgee.onKeyUpdate(forceRerender);
    subscriptionRef.current = subscription;
    if (!isLoaded) {
      subscription.subscribeNs(namespaces);
    }
    subscriptionQueue.current.forEach((key) => {
      subscription!.subscribeKey(key);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoaded, namespacesJoined]);

  useEffect(() => {
    tolgee.addActiveNs(namespaces);
    return () => tolgee.removeActiveNs(namespaces);
  }, [namespacesJoined]);

  const t = useCallback(
    (props: TranslateProps<any>) => {
      const fallbackNs = props.ns || namespaces?.[0];
      subscribeToKey({ key: props.key, ns: fallbackNs });
      return tolgee.t({ ...props, ns: fallbackNs }) as any;
    },
    [tolgee, instance]
  );

  if (currentOptions?.useSuspense && !isLoaded) {
    throw tolgee.addActiveNs(namespaces, true);
  }

  return { t, isLoading: !isLoaded };
};
