import { defineComponent, PropType } from 'vue';
import { Tolgee, TolgeeConfig, IcuFormatter } from '@tolgee/core';
import { TolgeeContext } from './types';

export const TolgeeProvider = defineComponent({
  name: 'TolgeeProvider',
  props: {
    config: { type: Object as PropType<TolgeeConfig>, required: true },
    loadingFallback: {
      type: [Object, String] as PropType<JSX.Element | string>,
    },
  },
  created() {
    const tolgee = Tolgee.use(IcuFormatter).init({ ...this.$props.config });

    this.tolgeeContext.tolgee = tolgee;
    this.tolgeeContext.language = tolgee.lang;

    this.loading = tolgee.initialLoading;

    tolgee.run().then(() => {
      this.loading = false;
    });
  },
  data() {
    return {
      tolgeeContext: {
        tolgee: null as Tolgee | null,
      } as unknown as TolgeeContext,
      loading: null as boolean | null,
    };
  },
  provide() {
    return {
      tolgeeContext: this.tolgeeContext as TolgeeContext,
    };
  },
  beforeUnmount() {
    this.tolgeeContext.tolgee?.stop();
    this.$options.langSubscription?.unsubscribe();
  },
  render() {
    return !this.loading
      ? this.$slots.default?.()
      : this.$slots.fallback?.() || this.loadingFallback || null;
  },
});
