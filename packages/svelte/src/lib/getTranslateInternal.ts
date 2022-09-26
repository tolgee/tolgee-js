import { writable, type Readable } from 'svelte/store';
import { onDestroy } from 'svelte';
import type {
  FallbackNSTranslation,
  KeyDescriptor,
  TolgeeInstance,
  TranslateProps,
} from '@tolgee/core';
import { getTolgeeContext } from '$lib/index';

const getTranslateInternal = (namespaces?: FallbackNSTranslation) => {
  const tolgeeContext = getTolgeeContext();

  const tolgee = tolgeeContext?.tolgee as TolgeeInstance;

  if (!tolgee) {
    throw new Error('Tolgee instance not provided');
  }

  const tFunction = createTFunction();

  const t = writable(tFunction);

  const subscription = tolgee.onKeyUpdate(() => {
    t.set(createTFunction());
    isLoading.set(!tolgee.isLoaded(namespaces));
  });

  subscription.subscribeNs(namespaces);
  tolgee.addActiveNs(namespaces);

  onDestroy(() => {
    subscription?.unsubscribe();
    tolgee.removeActiveNs(namespaces);
  });

  const isLoading = writable(!tolgee.isLoaded(namespaces));

  const subscribeToKey = (key: KeyDescriptor) => {
    subscription.subscribeKey(key);
  };

  function createTFunction() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (props: TranslateProps<any>) => {
      const { key, ns } = props;
      const fallbackNs = ns || namespaces?.[0];
      subscribeToKey({ key, ns: fallbackNs });
      return tolgee.t({ ...props, ns: fallbackNs });
    };
  }

  return {
    t: { subscribe: t.subscribe, value: t },
    isLoading: { subscribe: isLoading.subscribe } as Readable<boolean>,
  };
};

export default getTranslateInternal;