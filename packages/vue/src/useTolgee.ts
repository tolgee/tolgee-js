import { TolgeeEvent, TolgeeInstance } from '@tolgee/web';
import { inject, computed } from 'vue';
import { TolgeeVueContext } from './types';
import type { Ref, ComputedRef } from 'vue';

export const useTolgee = (events?: TolgeeEvent[]) => {
  const tolgeeContext: Ref<TolgeeVueContext> = inject('tolgeeContext');

  const tolgee: ComputedRef<TolgeeInstance> = computed(
    () => tolgeeContext.value.tolgee
  );

  return tolgee;
};
