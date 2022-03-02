import { defineComponent, PropType } from 'vue';
import { Subscription } from '@tolgee/core/lib/services/Subscription';
import { TolgeeContext } from './types';

export const T = defineComponent({
  name: 'T',
  props: {
    keyName: { type: String, required: true },
    parameters: Object as PropType<{ [key: string]: string }>,
    defaultValue: String as PropType<string>,
    /** @deprecated */
    strategy: {
      type: String as PropType<'ELEMENT_WRAP' | 'NO_WRAP'>,
      default: 'ELEMENT_WRAP',
    },
    noWrap: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['tolgeeContext'],
  data() {
    const tolgeeContext = this.tolgeeContext as unknown as TolgeeContext;
    if (!tolgeeContext) {
      throw new Error('T component used outside of TolgeeProvider');
    }
    return {
      translation:
        (this.$props.keyName &&
          tolgeeContext.tolgee.instant({
            key: this.$props.keyName || '',
            noWrap: this.$props.noWrap,
            params: this.$props.parameters,
            orEmpty: true,
          })) ||
        ('' as string),
      translationSubscription: null as Subscription | null,
      langSubscription: null as Subscription | null,
    };
  },
  methods: {
    translate() {
      const tolgeeContext = this.tolgeeContext as TolgeeContext;

      tolgeeContext.tolgee
        .translate({
          key: this.$props.keyName || '',
          noWrap: this.$props.noWrap,
          params: this.$props.parameters,
          defaultValue: this.$props.defaultValue,
        })
        .then((t) => {
          this.$data.translation = t;
        });
    },
    unsubscribe() {
      this.$data.translationSubscription?.unsubscribe();
      this.$data.langSubscription?.unsubscribe();
    },
    subscribe() {
      const tolgeeContext = this.tolgeeContext as TolgeeContext;

      this.translate();

      this.$data.translationSubscription =
        tolgeeContext.tolgee.onTranslationChange.subscribe(this.translate);

      this.$data.langSubscription = tolgeeContext.tolgee.onLangChange.subscribe(
        this.translate
      );
    },
  },
  created() {
    this.subscribe();
  },
  beforeUpdate() {
    this.unsubscribe();
    this.subscribe();
  },
  beforeUnmount() {
    this.unsubscribe();
  },
  render() {
    const content = this.$data.translation;
    return content;
  },
});
