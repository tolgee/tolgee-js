import { defineComponent } from 'vue';
import { Subscription } from '@tolgee/core/lib/services/Subscription';
import { TolgeeContext, TranslateFnProps } from './types';
import { TranslationParams } from '@tolgee/core';

export const TolgeeMixin = defineComponent({
  inject: ['tolgeeContext'],
  beforeCreate() {
    this.$options._tolgee = {
      subscribed_keys: [] as string[],
      subscribed_keys_ready: [] as string[],
      translation_sub: null as Subscription | null,
      lang_sub: null as Subscription | null,
    };
  },
  created() {
    const tolgeeContext = this.tolgeeContext as TolgeeContext;
    if (tolgeeContext) {
      // subscribe for language change
      this.$options._tolgee.lang_sub =
        tolgeeContext?.tolgee.onLangChange.subscribe((lang) => {
          // update tolgeeLanguage property
          this.tolgeeLanguage = lang;
          if (this.$options._tolgee.subscribed_keys?.length) {
            this._tolgee_reset_memory();
            this.$forceUpdate();
          }
        });

      // subscribe to translation changes
      this.$options._tolgee.translation_sub =
        tolgeeContext.tolgee.onTranslationChange.subscribe((data) => {
          if (this.$options._tolgee.subscribed_keys.includes(data.key)) {
            // update only if this component is using the key
            this.$forceUpdate();
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
      this.tolgeeContext.tolgee.changeLanguage(value);
    },
  },
  methods: {
    $t(
      keyOrProps: string | TranslateFnProps,
      ...params: (TranslationParams | boolean | string)[]
    ) {
      let parameters: TranslationParams = undefined;
      let noWrap: boolean = undefined;
      let defaultValue = undefined;
      // allow user to pass object of params and make the code cleaner
      const key = typeof keyOrProps === 'object' ? keyOrProps.key : keyOrProps;
      if (typeof keyOrProps === 'object') {
        parameters = keyOrProps.parameters;
        noWrap = keyOrProps.noWrap;
        defaultValue = keyOrProps.defaultValue;
      } else {
        params.forEach((param) => {
          switch (typeof param) {
            case 'object':
              parameters = param;
              break;
            case 'boolean':
              noWrap = param;
              break;
            case 'string':
              defaultValue = param;
          }
        });
      }

      const result = this._tolgee_get_translation(
        key,
        parameters,
        noWrap,
        defaultValue
      );
      return result;
    },

    _tolgee_reset_memory(key?: string) {
      this.subscribed_keys = key
        ? this.subscribed_keys.filter((k) => k !== key)
        : [];
      this.subscribed_keys_ready = key
        ? this.subscribed_keys_ready.filter((k) => k !== key)
        : [];
    },

    _tolgee_unsubscribe() {
      this.$options._tolgee?.lang_sub?.unsubscribe();
      this.$options._tolgee?.translation_sub?.unsubscribe();
    },

    // get key translation and register key
    _tolgee_get_translation(
      key: string,
      parameters?: TranslationParams,
      noWrap?: boolean,
      defaultValue?: string
    ) {
      const tolgeeContext = this.tolgeeContext as TolgeeContext;
      const firstRender = !this.$options._tolgee.subscribed_keys.includes(key);
      const ready = this.$options._tolgee.subscribed_keys_ready.includes(key);

      // take translation from cache
      const translation = tolgeeContext.tolgee.instant({
        key: key,
        params: parameters,
        noWrap,
        defaultValue: !ready ? undefined : defaultValue,
        orEmpty: !ready,
      });

      if (firstRender) {
        this.$options._tolgee.subscribed_keys.push(key);

        // if value not subscribed call translate
        tolgeeContext.tolgee
          .translate({ key: key, params: parameters, noWrap, defaultValue })
          .then((value) => {
            this.$options._tolgee.subscribed_keys_ready.push(key);
            if (value !== translation) {
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
    togleeLanguage: string;

    $t(props: TranslateFnProps): string;

    $t(key: string, defaultValue?: string, noWrap?: boolean): string;

    $t(
      key: string,
      defaultValue?: string,
      parameters?: TranslationParams
    ): string;

    $t(
      key: string,
      parameters?: TranslationParams,
      defaultValue?: string
    ): string;

    $t(
      key: string,
      parameters?: TranslationParams,
      noWrap?: boolean,
      defaultValue?: string
    ): string;
  }
}
