import type { App } from 'vue';
import { ref, watch } from 'vue';
import {
  getTranslateProps,
  TolgeeInstance,
  TFnType,
  DefaultParamType,
  TranslationKey,
} from '@tolgee/web';
import { TolgeeVueContext } from './types';

type Options = {
  tolgee?: TolgeeInstance;
  isSSR?: boolean;
};

export const VueTolgee = {
  install(app: App, options?: Options) {
    const tolgee = options?.tolgee;

    if (!tolgee) {
      throw new Error('Tolgee instance not passed in options');
    }

    const isSSR = Boolean(options?.isSSR);

    const reactiveContext = ref<TolgeeVueContext>({
      tolgee: tolgee,
      isInitialRender: isSSR,
    });

    app.provide('tolgeeContext', reactiveContext);

    if (isSSR) {
      const getOriginalTolgeeInstance = () => {
        return {
          ...reactiveContext.value.tolgee,
          t(...args) {
            // @ts-ignore
            const props = getTranslateProps(...args);
            return tolgee.t({ ...props });
          },
        };
      };

      const getTolgeeInstanceWithDeactivatedWrapper = () => {
        return {
          ...reactiveContext.value.tolgee,
          t(...args) {
            // @ts-ignore
            const props = getTranslateProps(...args);
            return tolgee.t({ ...props, noWrap: true });
          },
        };
      };

      reactiveContext.value.tolgee = getTolgeeInstanceWithDeactivatedWrapper();

      watch(
        () => reactiveContext.value.isInitialRender,
        (isInitialRender) => {
          if (!isInitialRender) {
            reactiveContext.value.tolgee = getOriginalTolgeeInstance();
          }
        }
      );
    }

    app.config.globalProperties.$t = (...args) => {
      // @ts-ignore
      return reactiveContext.value.tolgee.t(...args);
    };

    // keep it for backward compatibility
    // but it is not reactive
    // not recommended to use it
    app.config.globalProperties.$tolgee = reactiveContext.value.tolgee;
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
