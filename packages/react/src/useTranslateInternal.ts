import { useCallback, useEffect, useRef } from 'react';
import {
  ListenerSelective,
  TranslateProps,
  FallbackNsTranslation,
  getFallbackArray,
  getFallback,
  KeyDescriptor,
} from '@tolgee/web';

import { useTolgeeContext } from './useTolgeeContext';
import { ReactOptions } from './types';
import { useRerender } from './hooks';

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
  const { rerender, instance } = useRerender();

  const subscriptionRef = useRef<ListenerSelective>();

  const subscriptionQueue = useRef([] as KeyDescriptor[]);
  subscriptionQueue.current = [];

  const subscribeToKey = (key: KeyDescriptor) => {
    subscriptionQueue.current.push(key);
    subscriptionRef.current?.subscribeKey(key);
  };

  const isLoaded = tolgee.isLoaded(namespaces);

  useEffect(() => {
    const subscription = tolgee.onKeyUpdate(rerender);
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

  if (currentOptions.useSuspense && !isLoaded) {
    throw tolgee.addActiveNs(namespaces, true);
  }

  return { t, isLoading: !isLoaded };
};
