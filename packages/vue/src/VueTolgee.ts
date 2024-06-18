import type { App } from 'vue';
import { ref } from 'vue';
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

    const createTFunc = () => {
      return (...props) => {
        // @ts-ignore
        const params = getTranslateProps(...props);
        return tolgee.t(params);
      };
    };

    const tFunc = ref(createTFunc());
    tolgee.on('update', () => {
      tFunc.value = createTFunc();
    });

    app.mixin({
      beforeCreate() {
        this.$options.__keySubscription = tolgee.on('update', () => {
          this.$t = createTFunc();
        });
      },
      unmounted() {
        this.$options.__keySubscription.unsubscribe();
      },
      computed: {
        $t: {
          get() {
            return tFunc.value;
          },
          set(value: ReturnType<typeof createTFunc>) {
            tFunc.value = value;
          },
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
