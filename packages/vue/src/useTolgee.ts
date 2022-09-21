import { TolgeeEvent } from '@tolgee/core';
import { getCurrentInstance, inject, onUnmounted, ref } from 'vue';
import { TolgeeVueContext } from './types';

const DEFAULT_EVENTS: TolgeeEvent[] = ['language', 'pendingLanguage'];

export const useTolgee = (events: TolgeeEvent[] = DEFAULT_EVENTS) => {
  const tolgeeContext = inject('tolgeeContext', {
    tolgee: getCurrentInstance().proxy.$tolgee,
  }) as TolgeeVueContext;

  const tolgee = ref(tolgeeContext.tolgee);

  const listeners = events.map((e) =>
    tolgee.value.on(e, () => {
      tolgee.value = Object.freeze({ ...tolgee.value });
    })
  );

  onUnmounted(() => {
    listeners.forEach((listener) => listener.unsubscribe());
  });

  return tolgee;
};
