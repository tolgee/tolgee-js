import {
  TolgeeInstance,
  TranslateProps,
  NsFallback,
  getFallback,
} from '@tolgee/web';
import { inject, onUnmounted, ref, computed } from 'vue';
import { TolgeeVueContext } from './types';
import type { Ref, ComputedRef } from 'vue';

export const useTranslateInternal = (ns?: NsFallback) => {
  const namespaces = getFallback(ns);
  const tolgeeContext: Ref<TolgeeVueContext> = inject('tolgeeContext');

  const tolgee: ComputedRef<TolgeeInstance> = computed(
    () => tolgeeContext.value.tolgee
  );

  if (!tolgee.value) {
    throw new Error('Tolgee instance not provided');
  }
  const t = ref(createTFunction());

  const subscription = tolgee.value.onNsUpdate(() => {
    t.value = createTFunction();
    isLoading.value = !tolgee.value.isLoaded(namespaces);
  });
  subscription.subscribeNs(namespaces);
  tolgee.value.addActiveNs(namespaces);

  onUnmounted(() => {
    subscription?.unsubscribe();
    tolgee.value.removeActiveNs(namespaces);
  });

  const isLoading = ref(!tolgee.value.isLoaded(namespaces));

  const subscribeToNs = (ns: NsFallback) => {
    subscription.subscribeNs(ns);
  };

  function createTFunction() {
    return (props: TranslateProps<any>) => {
      const fallbackNs = props.ns ?? namespaces?.[0];
      subscribeToNs(fallbackNs);
      return tolgee.value.t({ ...props, ns: fallbackNs }) as any;
    };
  }

  return { t, isLoading };
};
