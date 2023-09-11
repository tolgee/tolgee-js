import { useCallback, useEffect, useRef } from 'react';
import {
  SubscriptionSelective,
  TranslateProps,
  NsFallback,
  getFallbackArray,
  getFallback,
} from '@tolgee/web';

import { useTolgeeContext } from './useTolgeeContext';
import { ReactOptions } from './types';
import { useRerender } from './hooks';

export const useTranslateInternal = (
  ns?: NsFallback,
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

  const subscriptionRef = useRef<SubscriptionSelective>();

  const subscriptionQueue = useRef([] as NsFallback[]);
  subscriptionQueue.current = [];

  const subscribeToNs = (ns: NsFallback) => {
    subscriptionQueue.current.push(ns);
    subscriptionRef.current?.subscribeNs(ns);
  };

  const isLoaded = tolgee.isLoaded(namespaces);

  useEffect(() => {
    const subscription = tolgee.onNsUpdate(rerender);
    subscriptionRef.current = subscription;
    subscription.subscribeNs(namespaces);
    subscriptionQueue.current.forEach((ns) => {
      subscription!.subscribeNs(ns);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [namespacesJoined, tolgee]);

  useEffect(() => {
    tolgee.addActiveNs(namespaces);
    return () => tolgee.removeActiveNs(namespaces);
  }, [namespacesJoined, tolgee]);

  const t = useCallback(
    (props: TranslateProps<any>) => {
      const fallbackNs = props.ns ?? namespaces?.[0];
      subscribeToNs(fallbackNs);
      return tolgee.t({ ...props, ns: fallbackNs }) as any;
    },
    [tolgee, instance]
  );

  if (currentOptions.useSuspense && !isLoaded) {
    throw tolgee.addActiveNs(namespaces, true);
  }

  return { t, isLoading: !isLoaded };
};
