import type { App } from 'vue';
import {
  getTranslateProps,
  TolgeeInstance,
  TFnType,
  DefaultParamType,
  TranslationKey,
} from '@tolgee/web';

type Options = {
  tolgee?: TolgeeInstance;
};

export const VueTolgee = {
  install(app: App, options?: Options) {
    const tolgee = options?.tolgee;

    if (!tolgee) {
      throw new Error('Tolgee instance not passed in options');
    }

    app.mixin({
      beforeCreate() {
        this.$options.__keySubscription = tolgee.onNsUpdate(() => {
          this.$forceUpdate();
        });
      },
      unmounted() {
        this.$options.__keySubscription.unsubscribe();
      },
      methods: {
        // @ts-ignore
        $t(...props) {
          // @ts-ignore
          const params = getTranslateProps(...props);
          const { ns } = params;
          this.$options.__keySubscription.subscribeNs(ns);
          return tolgee.t(params);
        },
      },
    });
    app.config.globalProperties.$tolgee = tolgee;
  },
};

declare module 'vue' {
  export interface ComponentCustomProperties {
    $t: TFnType<DefaultParamType, string, TranslationKey>;
    $tolgee: TolgeeInstance;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $t: TFnType<DefaultParamType, string, TranslationKey>;
    $tolgee: TolgeeInstance;
  }
}
