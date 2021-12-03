import { defineComponent } from 'vue';
import { Subscription } from '@tolgee/core/lib/services/Subscription';
import { TranslationParameters, TranslateFnProps } from './types';
import { TolgeeContext } from './types';

export const TolgeeMixin = defineComponent({
  inject: ['tolgeeContext'],
  beforeCreate() {
    this.$options._tolgee = {
      subscribed_keys: [] as string[],
      translation_sub: null as Subscription | null,
      lang_sub: null as Subscription | null,
    };
  },
  created() {
    const tolgeeContext = this.tolgeeContext as TolgeeContext;
    if (tolgeeContext) {
      // for language we subscribe always
      this.$options._tolgee.lang_sub =
        tolgeeContext?.tolgee.onLangChange.subscribe((lang) => {
          // update tolgeeLanguage property
          this.tolgeeLanguage = lang;
          // if there are subscribed keys
          // call stranslate on first key
          // then cause re-render, so all used keys are translated
          const firstSubscribed = this.$options._tolgee.subscribed_keys[0];
          if (firstSubscribed) {
            tolgeeContext.tolgee
              .translate({ key: firstSubscribed })
              .then(() => {
                this.$forceUpdate();
              });
          }
        });
    } else {
      throw new Error(
        `TolgeeMixin: tolgeeContext not provided for "${this.$options.name}". Did you use TolgeeProvider correctly?`
      );
    }
  },
  data() {
    const tolgeeContext = this.tolgeeContext as unknown as TolgeeContext;
    return {
      tolgeeLanguage: tolgeeContext.tolgee.lang,
    };
  },
  watch: {
    // user setting language in component
    tolgeeLanguage: function (value: string) {
      this.tolgeeContext.tolgee.lang = value;
    },
  },
  methods: {
    $t(
      keyOrProps: string | TranslateFnProps,
      parameters?: TranslationParameters,
      noWrap?: boolean,
      defaultValue?: string
    ) {
      // allow user to pass object of params and make the code cleaner
      const key = typeof keyOrProps === 'string' ? keyOrProps : keyOrProps.key;
      if (typeof keyOrProps === 'object') {
        parameters = keyOrProps.parameters;
        noWrap = keyOrProps.noWrap;
        defaultValue = keyOrProps.defaultValue;
      }

      const result = this._tolgee_subscribe(
        key,
        parameters,
        noWrap,
        defaultValue
      );
      return result;
    },

    _tolgee_unsubscribe() {
      this.$options._tolgee?.lang_sub?.unsubscribe();
      this.$options._tolgee?.translation_sub?.unsubscribe();
    },
    // get key translation and subscribe to changes
    _tolgee_subscribe(
      key: string,
      parameters?: TranslationParameters,
      noWrap?: boolean,
      defaultValue?: string
    ) {
      const tolgeeContext = this.tolgeeContext as TolgeeContext;

      // take translation from cache
      const translation = tolgeeContext.tolgee.instant({
        key: key,
        params: parameters,
        noWrap,
        defaultValue,
      });

      if (!this.$options._tolgee.subscribed_keys.includes(key)) {
        this.$options._tolgee.subscribed_keys.push(key);

        // if value not subscribed call translate
        tolgeeContext.tolgee
          .translate({ key: key, params: parameters, noWrap, defaultValue })
          .then((value) => {
            if (value !== translation) {
              this.$forceUpdate();
            }
          });
      }

      // subscribe to translation changes
      if (!this.$options._tolgee.translation_sub) {
        this.$options._tolgee.translation_sub =
          tolgeeContext.tolgee.onTranslationChange.subscribe((data) => {
            if (this.$options._tolgee.subscribed_keys.includes(data.key)) {
              // update only if this component is using the key
              this.$forceUpdate();
            }
          });
      }

      return translation;
    },
  },
  beforeUnmount() {
    this._tolgee_unsubscribe();
  },
});

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $t(
      key: string,
      parameters?: TranslationParameters,
      noWrap?: boolean,
      defaultValue?: string
    ): string;
    $t(props: TranslateFnProps): string;
    togleeLanguage: string;
  }
}
