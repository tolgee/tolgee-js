import { defineComponent, PropType } from 'vue';
import { useTranslate } from './useTranslate';
import { TranslateFnProps } from '.';

export const T = defineComponent({
  name: 'T',
  props: {
    keyName: { type: String, required: true },
    parameters: Object as PropType<{ [key: string]: string }>,
    defaultValue: String as PropType<string>,
    noWrap: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const t = useTranslate();
    return { t };
  },
  render() {
    const params: TranslateFnProps = {
      key: this.$props.keyName,
      parameters: this.$props.parameters,
      defaultValue: this.$props.defaultValue,
      noWrap: this.noWrap,
    };
    const content = this.t(params);
    return content;
  },
});
