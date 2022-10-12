import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ListenerSelective,
  KeyDescriptor,
  TranslateProps,
  FallbackNSTranslation,
  getFallbackArray,
  getFallback,
} from '@tolgee/web';

import { useTolgeeContext } from './useTolgeeContext';
import { ReactOptions } from './types';

export const useTranslateInternal = (
  ns?: FallbackNSTranslation,
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

  const subscribeToKey = (key: KeyDescriptor) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.subscribeKey(key);
    } else {
      subscriptionQueue.current.push(key);
    }
  };

  const isLoaded = tolgee.isLoaded(namespaces);

  useEffect(() => {
    subscriptionRef.current = tolgee.onKeyUpdate(forceRerender);
    subscriptionQueue.current.forEach((key) => {
      subscriptionRef.current!.subscribeKey(key);
    });
    subscriptionQueue.current = [];
    return () => {
      subscriptionRef.current!.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      subscriptionRef.current!.subscribeNs(namespaces);
    }
  }, [namespacesJoined, isLoaded]);

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
