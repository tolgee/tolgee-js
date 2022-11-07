import {
  ListenerSelective,
  TolgeeInstance,
  TranslateProps,
  KeyDescriptor,
  FallbackNsTranslation,
  getFallback,
} from '@tolgee/web';
import {
  inject,
  onBeforeMount,
  onUnmounted,
  ref,
  getCurrentInstance,
} from 'vue';
import { TolgeeVueContext } from './types';

export const useTranslateInternal = (ns?: FallbackNsTranslation) => {
  const namespaces = getFallback(ns);
  const tolgeeContext = inject('tolgeeContext', {
    tolgee: getCurrentInstance().proxy.$tolgee,
  }) as TolgeeVueContext;

  const tolgee = tolgeeContext?.tolgee as TolgeeInstance;

  if (!tolgee) {
    throw new Error('Tolgee instance not provided');
  }
  const t = ref(createTFunction());

  let subscription: ListenerSelective;
  onBeforeMount(() => {
    const tolgee = tolgeeContext.tolgee as TolgeeInstance;
    subscription = tolgee.onKeyUpdate(() => {
      t.value = createTFunction();
      isLoading.value = !tolgee.isLoaded(namespaces);
    });
    subscription.subscribeNs(namespaces);
    tolgee.addActiveNs(namespaces);
  });

  onUnmounted(() => {
    subscription?.unsubscribe();
    tolgee.removeActiveNs(namespaces);
  });

  const isLoading = ref(!tolgee.isLoaded(namespaces));

  const subscribeToKey = (key: KeyDescriptor) => {
    subscription.subscribeKey(key);
  };

  function createTFunction() {
    return (props: TranslateProps<any>) => {
      const fallbackNs = props.ns || namespaces?.[0];
      subscribeToKey({ key: props.key, ns: fallbackNs });
      return tolgee.t({ ...props, ns: fallbackNs }) as any;
    };
  }

  return { t, isLoading };
};
