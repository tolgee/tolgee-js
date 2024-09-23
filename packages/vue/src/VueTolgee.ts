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
  enableSSR?: boolean;
};

type TolgeeT = TolgeeInstance['t'];

export const VueTolgee = {
  install(app: App, options?: Options) {
    const tolgee = options?.tolgee;

    if (!tolgee) {
      throw new Error('Tolgee instance not passed in options');
    }

    const isSsrEnabled = Boolean(options?.enableSSR);

    const reactiveContext = ref<TolgeeVueContext>({
      tolgee: tolgee,
      isInitialRender: isSsrEnabled,
    });

    app.provide('tolgeeContext', reactiveContext);

    if (isSsrEnabled) {
      const getOriginalTolgeeInstance = (): TolgeeInstance => ({
        ...reactiveContext.value.tolgee,
        t: ((...args: Parameters<TolgeeT>) => {
          const props = getTranslateProps(...args);
          return tolgee.t({ ...props });
        }) as TolgeeT,
      });
      const getTolgeeInstanceWithDeactivatedWrapper = (): TolgeeInstance => ({
        ...reactiveContext.value.tolgee,
        t: ((...args: Parameters<TolgeeT>) => {
          const props = getTranslateProps(...args);
          return tolgee.t({ ...props, noWrap: true });
        }) as TolgeeT,
      });

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

    reactiveContext.value.tolgee.on('cache', () => {
      reactiveContext.value.tolgee = Object.freeze({
        ...reactiveContext.value.tolgee,
      });
    });

    app.config.globalProperties.$t = ((...args: Parameters<TolgeeT>) =>
      reactiveContext.value.tolgee.t(...args)) as TolgeeT;

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
