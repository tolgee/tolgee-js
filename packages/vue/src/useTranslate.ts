import {
  DefaultParamType,
  FallbackNsTranslation,
  TFnType,
  getTranslateParams,
} from '@tolgee/web';
import { computed, Ref } from 'vue';
import { useTranslateInternal } from './useTranslateInternal';

export const useTranslate = (namespaces?: FallbackNsTranslation) => {
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
