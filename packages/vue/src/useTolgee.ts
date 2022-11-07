import { TolgeeEvent } from '@tolgee/web';
import { getCurrentInstance, inject, onUnmounted, ref } from 'vue';
import { TolgeeVueContext } from './types';

export const useTolgee = (events?: TolgeeEvent[]) => {
  const instance = getCurrentInstance();
  const tolgeeContext = inject('tolgeeContext', {
    tolgee: instance.proxy.$tolgee,
  }) as TolgeeVueContext;

  const tolgee = ref(tolgeeContext.tolgee);

  const listeners = events?.map((e) =>
    tolgee.value.on(e, () => {
      tolgee.value = Object.freeze({ ...tolgee.value });
      instance.proxy.$forceUpdate();
    })
  );

  onUnmounted(() => {
    listeners?.forEach((listener) => listener.unsubscribe());
  });

  return tolgee;
};
