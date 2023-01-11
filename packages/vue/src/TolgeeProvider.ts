/* eslint-disable @typescript-eslint/no-var-requires */
import {
  defineComponent,
  PropType,
  getCurrentInstance,
  provide,
  onBeforeMount,
  onUnmounted,
  ref,
} from 'vue';
import { TolgeeInstance } from '@tolgee/web';
import { TolgeeVueContext } from './types';

export const TolgeeProvider = defineComponent({
  name: 'TolgeeProvider',
  props: {
    tolgee: { type: Object as PropType<TolgeeInstance>, required: false },
    fallback: {
      type: [Object, String] as PropType<JSX.Element | string>,
    },
  },

  setup(props) {
    const tolgee: TolgeeInstance | undefined =
      props.tolgee || getCurrentInstance().proxy.$tolgee;

    if (!tolgee) {
      throw new Error('Tolgee instance not provided');
    }

    provide('tolgeeContext', { tolgee } as TolgeeVueContext);

    const isLoading = ref(!tolgee.isLoaded());

    onBeforeMount(() => {
      tolgee.run().then(() => {
        isLoading.value = false;
      });
    });

    onUnmounted(() => {
      tolgee.stop();
    });
    return { isLoading };
  },

  render() {
    return !this.isLoading
      ? this.$slots.default?.()
      : this.$slots.fallback?.() || this.fallback || null;
  },
});
