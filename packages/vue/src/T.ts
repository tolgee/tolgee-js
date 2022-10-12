import {
  FallbackNsTranslation,
  TranslateParams,
  TranslateProps,
} from '@tolgee/web';
import { defineComponent, PropType } from 'vue';
import { useTranslateInternal } from './useTranslateInternal';

export const T = defineComponent({
  name: 'T',
  props: {
    keyName: { type: String, required: true },
    params: Object as PropType<TranslateParams>,
    defaultValue: String as PropType<string>,
    noWrap: {
      type: Boolean,
      default: false,
    },
    ns: { type: Object as PropType<FallbackNsTranslation> },
  },
  setup() {
    const { t } = useTranslateInternal();
    return { t };
  },
  render() {
    const params: TranslateProps = {
      key: this.$props.keyName,
      params: this.$props.params,
      defaultValue: this.$props.defaultValue,
      noWrap: this.$props.noWrap,
      ns: this.$props.ns,
    };
    const content = this.t(params);
    return content;
  },
});
