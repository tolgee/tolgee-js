import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ListenerSelective,
  KeyDescriptor,
  TranslateProps,
  FallbackNSTranslation,
  getFallback,
} from '@tolgee/core';

import { useTolgeeContext } from './useTolgeeContext';

export const useTranslateInternal = (namespaces?: FallbackNSTranslation) => {
  const tolgee = useTolgeeContext();

  // dummy state to enable re-rendering
  const [instance, setInstance] = useState(0);

  const forceRerender = useCallback(() => {
    setInstance((v) => v + 1);
  }, [setInstance]);

  const subscriptionRef = useRef(null as ListenerSelective);

  const subscriptionQueue = useRef([] as KeyDescriptor[]);

  useEffect(() => {
    tolgee.addActiveNs(namespaces);
    return () => tolgee.removeActiveNs(namespaces);
  }, [getFallback(namespaces).join(':')]);

  const subscribeToKey = (key: KeyDescriptor) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.subscribeToKey(key);
    } else {
      subscriptionQueue.current.push(key);
    }
  };

  useEffect(() => {
    subscriptionRef.current = tolgee.onKeyUpdate(forceRerender);
    subscriptionQueue.current.forEach((key) =>
      subscriptionRef.current.subscribeToKey(key)
    );
    subscriptionQueue.current = [];
    return () => {
      subscriptionRef.current.unsubscribe();
    };
  }, []);

  const t = useCallback(
    (props: TranslateProps<any>) => {
      const { key, ns } = props;
      subscribeToKey({ key, ns });
      return tolgee.t(props) as any;
    },
    [tolgee, instance]
  );

  return t;
};
