/* eslint-disable @typescript-eslint/no-var-requires */
import {
  defineComponent,
  PropType,
  onBeforeMount,
  onUnmounted,
  ref,
  inject,
  onMounted,
  computed,
} from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { TolgeeInstance, TolgeeStaticData } from '@tolgee/web';
import { TolgeeVueContext } from './types';

export const TolgeeProvider = defineComponent({
  name: 'TolgeeProvider',
  props: {
    tolgee: { type: Object as PropType<TolgeeInstance>, required: false },
    fallback: {
      type: [Object, String] as PropType<JSX.Element | string>,
    },
    staticData: {
      type: Object as PropType<TolgeeStaticData>,
      default: undefined,
    },
    language: {
      type: String as PropType<string>,
      default: 'en',
    },
  },

  setup(props) {
    const tolgeeContext: Ref<TolgeeVueContext> = inject('tolgeeContext');

    // for backward compatibility
    if (props.tolgee) {
      tolgeeContext.value.tolgee = props.tolgee;
    }

    const tolgee: ComputedRef<TolgeeInstance> = computed(
      () => tolgeeContext.value.tolgee
    );

    if (!tolgee.value) {
      throw new Error('Tolgee instance not provided');
    }

    if (tolgeeContext.value.isInitialRender) {
      tolgee.value.setEmitterActive(false);
      tolgee.value.addStaticData(props.staticData);
      tolgee.value.changeLanguage(props.language);
      tolgee.value.setEmitterActive(true);

      if (!tolgee.value.isLoaded()) {
        // warning user, that static data provided are not sufficient
        // for proper SSR render
        const missingRecords = tolgee.value
          .getRequiredRecords(props.language)
          .map(({ namespace, language }) =>
            namespace ? `${namespace}:${language}` : language
          )
          .filter((key) => !props.staticData?.[key]);

        // eslint-disable-next-line no-console
        console.warn(
          `Tolgee: Missing records in "staticData" for proper SSR functionality: ${missingRecords.map((key) => `"${key}"`).join(', ')}`
        );
      }
    }

    onMounted(() => {
      tolgeeContext.value.isInitialRender = false;
    });

    const isLoading = ref(!tolgee.value.isLoaded());

    onBeforeMount(() => {
      tolgee.value.run().finally(() => {
        isLoading.value = false;
      });
    });

    onUnmounted(() => {
      tolgee.value.stop();
    });
    return { isLoading };
  },

  render() {
    return !this.isLoading
      ? this.$slots.default?.()
      : this.$slots.fallback?.() || this.fallback || null;
  },
});
