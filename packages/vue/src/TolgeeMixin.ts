import { defineComponent } from 'vue';
import { Subscription } from '@tolgee/core/lib/services/Subscription';
import { TolgeeContext, TranslateFnProps } from './types';
import { TranslationParams } from '@tolgee/core';

export const TolgeeMixin = defineComponent({
  inject: ['tolgeeContext'],
  beforeCreate() {
    this.$options._tolgee = {
      subscribedKeys: [] as string[],
      subscribedKeysReady: [] as string[],
      translationSub: null as Subscription | null,
      langSub: null as Subscription | null,
    };
  },
  created() {
    const tolgeeContext = this.tolgeeContext as TolgeeContext;
    if (tolgeeContext) {
      // subscribe for language change
      this.$options._tolgee.langSub =
        tolgeeContext?.tolgee.onLangChange.subscribe((lang) => {
          // update tolgeeLanguage property
          this.tolgeeLanguage = lang;
          if (this.$options._tolgee.subscribedKeys?.length) {
            this._tolgeeResetMemory();
            this.$forceUpdate();
          }
        });

      // subscribe to translation changes
      this.$options._tolgee.translationSub =
        tolgeeContext.tolgee.onTranslationChange.subscribe((data) => {
          if (this.$options._tolgee.subscribedKeys.includes(data.key)) {
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

      const result = this._tolgeeGetTranslation(
        key,
        parameters,
        noWrap,
        defaultValue
      );
      return result;
    },

    _tolgeeResetMemory(key?: string) {
      this.subscribedKeys = key
        ? this.subscribedKeys.filter((k) => k !== key)
        : [];
      this.subscribedKeysReady = key
        ? this.subscribedKeysReady.filter((k) => k !== key)
        : [];
    },

    _tolgeeUnsubscribe() {
      this.$options._tolgee?.langSub?.unsubscribe();
      this.$options._tolgee?.translationSub?.unsubscribe();
    },

    // get key translation and register key
    _tolgeeGetTranslation(
      key: string,
      parameters?: TranslationParams,
      noWrap?: boolean,
      defaultValue?: string
    ) {
      const tolgeeContext = this.tolgeeContext as TolgeeContext;
      const firstRender = !this.$options._tolgee.subscribedKeys.includes(key);
      const ready = this.$options._tolgee.subscribedKeysReady.includes(key);

      // take translation from cache
      const translation = tolgeeContext.tolgee.instant({
        key: key,
        params: parameters,
        noWrap,
        defaultValue: !ready ? undefined : defaultValue,
        orEmpty: !ready,
      });

      if (firstRender) {
        this.$options._tolgee.subscribedKeys.push(key);

        // if value not subscribed call translate
        tolgeeContext.tolgee
          .translate({ key: key, params: parameters, noWrap, defaultValue })
          .then((value) => {
            this.$options._tolgee.subscribedKeysReady.push(key);
            if (value !== translation) {
              this.$forceUpdate();
            }
          });
      }

      return translation;
    },
  },
  beforeUnmount() {
    this._tolgeeUnsubscribe();
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
