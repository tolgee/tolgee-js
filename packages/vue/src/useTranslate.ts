import {
  DefaultParamType,
  NsFallback,
  TFnType,
  getTranslateProps,
} from '@tolgee/web';
import { computed, Ref } from 'vue';
import { useTranslateInternal } from './useTranslateInternal';

export const useTranslate = (namespaces?: NsFallback) => {
  const { t: tInternal, isLoading } = useTranslateInternal(namespaces);

  const t: Ref<TFnType<DefaultParamType, string>> = computed(
    () =>
      (...params: any) => {
        // @ts-ignore
        const props = getTranslateProps(...params);
        return tInternal.value(props);
      }
  );

  return { t, isLoading };
};
