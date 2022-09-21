import {
  DefaultParamType,
  FallbackNSTranslation,
  TFnType,
  getTranslateParams,
} from '@tolgee/core';
import { computed, Ref } from 'vue';
import { useTranslateInternal } from './useTranslateInternal';

export const useTranslate = (namespaces?: FallbackNSTranslation) => {
  const { t: tInternal, isLoading } = useTranslateInternal(namespaces);

  const t: Ref<TFnType<DefaultParamType, string>> = computed(
    () =>
      (...params: any) => {
        // @ts-ignore
        const props = getTranslateParams(...params);
        return tInternal.value(props);
      }
  );

  return { t, isLoading };
};
