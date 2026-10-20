import {
  NsType,
  TranslateParams,
  TranslateProps,
  TranslationKey,
} from '@tolgee/web';
import { defineComponent, h, VNode } from 'vue';
import type { PropType } from 'vue';
import { useTranslateInternal } from './useTranslateInternal';

export const T2 = defineComponent({
  name: 'T2',
  props: {
    modelValue: { type: String as PropType<TranslationKey>, required: true },
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
    return { t };
  },
  render() {
    // Get the translation text first
    const params: TranslateProps = {
      key: this.$props.modelValue,
      params: this.$props.params,
      defaultValue: this.$props.defaultValue,
      noWrap: this.$props.noWrap,
      ns: this.$props.ns,
      language: this.$props.language,
    };

    const translatedText = this.t(params);

    // If translation returns a VNode (for existing functionality), return it as is
    if (typeof translatedText !== 'string') {
      return translatedText;
    }

    // Parse the text for XML-like tags and replace them with slot content
    const parseAndReplaceSlots = (text: string): (string | VNode)[] => {
      const result: (string | VNode)[] = [];
      let currentIndex = 0;

      // Find all opening tags like <slot-name>
      const tagRegex = /<([a-zA-Z-]+)>(.*?)<\/\1>/g;
      let match;

      while ((match = tagRegex.exec(text)) !== null) {
        const [fullMatch, slotName, innerText] = match;
        const startIndex = match.index;

        // Add text before the tag
        if (startIndex > currentIndex) {
          const beforeText = text.slice(currentIndex, startIndex);
          if (beforeText) {
            result.push(beforeText);
          }
        }

        // Check if we have a slot for this tag
        if (this.$slots[slotName]) {
          // Call the slot with the inner text as parameter
          const slotContent = this.$slots[slotName]({ text: innerText });
          if (Array.isArray(slotContent)) {
            result.push(...slotContent);
          } else if (slotContent) {
            result.push(slotContent);
          }
        } else {
          // If no slot found, just add the inner text
          result.push(innerText);
        }

        currentIndex = startIndex + fullMatch.length;
      }

      // Add remaining text after the last tag
      if (currentIndex < text.length) {
        const remainingText = text.slice(currentIndex);
        if (remainingText) {
          result.push(remainingText);
        }
      }

      return result;
    };

    const parsedContent = parseAndReplaceSlots(translatedText);

    // If we have only one element and it's a string, return it directly
    if (parsedContent.length === 1 && typeof parsedContent[0] === 'string') {
      return parsedContent[0];
    }

    // Otherwise, wrap in a fragment or span
    if (this.$props.noWrap) {
      return parsedContent;
    }

    return h('span', {}, parsedContent);
  },
});
