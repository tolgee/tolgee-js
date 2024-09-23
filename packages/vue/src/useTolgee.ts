import { TolgeeEvent, TolgeeInstance } from '@tolgee/web';
import { inject, computed, onUnmounted, getCurrentInstance } from 'vue';
import { TolgeeVueContext } from './types';
import type { Ref, ComputedRef } from 'vue';

export const useTolgee = (events?: TolgeeEvent[]) => {
  const instance = getCurrentInstance();
  const tolgeeContext: Ref<TolgeeVueContext> = inject('tolgeeContext');

  const tolgee: ComputedRef<TolgeeInstance> = computed(
    () => tolgeeContext.value.tolgee
  );

  const listeners = events?.map((e) => {
    return tolgee.value.on(e, () => {
      tolgeeContext.value.tolgee = Object.freeze({ ...tolgee.value });
      instance.proxy.$forceUpdate();
    });
  });

  onUnmounted(() => {
    listeners?.forEach((listener) => listener.unsubscribe());
  });

  return tolgee;
};
