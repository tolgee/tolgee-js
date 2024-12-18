import { useCallback, useEffect, useRef } from 'react';
import {
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

  const subscriptionQueue = useRef([] as NsFallback[]);
  subscriptionQueue.current = [];

  const isLoaded = tolgee.isLoaded(namespaces);

  useEffect(() => {
    const subscription = tolgee.on('update', rerender);

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
      return tolgee.t({ ...props, ns: fallbackNs }) as any;
    },
    [tolgee, instance]
  );

  if (currentOptions.useSuspense && !isLoaded) {
    throw tolgee.addActiveNs(namespaces, true);
  }

  return { t, isLoading: !isLoaded };
};
