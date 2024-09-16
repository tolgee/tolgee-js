import {
  NsType,
  TranslateParams,
  TranslateProps,
  TranslationKey,
} from '@tolgee/web';
import { defineComponent, inject, computed } from 'vue';
import type { Ref, PropType } from 'vue';
import { useTranslateInternal } from './useTranslateInternal';
import { TolgeeVueContext } from './types';

export const T = defineComponent({
  name: 'T',
  props: {
    keyName: { type: String as PropType<TranslationKey>, required: true },
    params: Object as PropType<TranslateParams>,
    defaultValue: String as PropType<string>,
    noWrap: {
      type: Boolean,
      default: false,
    },
    ns: { type: String as PropType<NsType> },
    language: { type: String as PropType<string> },
  },
  setup() {
    const { t } = useTranslateInternal();
    const tolgeeContext: Ref<TolgeeVueContext> = inject('tolgeeContext');
    const isInitialRender = computed(() => tolgeeContext.value.isInitialRender);
    return { t, isInitialRender };
  },
  render() {
    const slotsParams = {};
    Object.keys(this.$slots).forEach((key) => {
      slotsParams[key] = this.$slots[key]();
    });
    const assignedParams = Object.assign({}, this.$props.params, slotsParams);

    const params: TranslateProps = {
      key: this.$props.keyName,
      params: assignedParams,
      defaultValue: this.$props.defaultValue,
      noWrap: this.isInitialRender || this.$props.noWrap,
      ns: this.$props.ns,
      language: this.$props.language,
    };
    const content = this.t(params);
    return content;
  },
});
