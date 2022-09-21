import type { App } from 'vue';
import {
  getTranslateParams,
  TolgeeInstance,
  TFnType,
  DefaultParamType,
} from '@tolgee/core';

type Options = {
  tolgee?: TolgeeInstance;
};

export const TolgeeVue = {
  install(app: App, options?: Options) {
    const tolgee = options?.tolgee;

    if (!tolgee) {
      throw new Error('Tolgee instance not passed in options');
    }

    app.mixin({
      beforeCreate() {
        this.$options.__keySubscription = tolgee.onKeyUpdate(() => {
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
          const params = getTranslateParams(...props);
          const { key, ns } = params;
          this.$options.__keySubscription.subscribeKey({ key, ns: ns });
          return tolgee.t(params);
        },
      },
    });
    app.config.globalProperties.$tolgee = tolgee;
  },
};

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $t: TFnType<DefaultParamType, string>;
    $tolgee: TolgeeInstance;
  }
}
