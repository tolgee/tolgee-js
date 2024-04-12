import {
  NsType,
  TranslateParams,
  TranslateProps,
  TranslationKey,
} from '@tolgee/web';
import { defineComponent, PropType, Fragment, h, SetupContext } from 'vue';
import { useTranslateInternal } from './useTranslateInternal';
import { convertStringToVNodeArrayWithSlots } from './lib/convertStringToVNodeArrayWithSlots';

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
  setup(props, context: SetupContext) {
    const { slots } = context;
    const { params } = props;
    const slotsName = Object.keys(slots).filter((key) => key !== '_');
    const slotsParams = {};
    slotsName.forEach((key) => {
      slotsParams[key] = `{${key}}`;
    });

    const { t } = useTranslateInternal();
    const assignedParams = Object.assign({}, params, slotsParams);
    return { t, assignedParams, slots, slotsName };
  },
  render() {
    const params: TranslateProps = {
      key: this.$props.keyName,
      params: this.assignedParams,
      defaultValue: this.$props.defaultValue,
      noWrap: this.$props.noWrap,
      ns: this.$props.ns,
      language: this.$props.language,
    };
    const content = this.t(params);

    if (this.slotsName.length === 0) return content;

    const arrayOfChildren = convertStringToVNodeArrayWithSlots(
      content,
      this.slots
    );
    return h(Fragment, arrayOfChildren);
  },
});
