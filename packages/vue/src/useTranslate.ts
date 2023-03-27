import {
  DefaultParamType,
  NsFallback,
  TFnType,
  getTranslateProps,
  TranslationKey,
} from '@tolgee/web';
import { computed, Ref } from 'vue';
import { useTranslateInternal } from './useTranslateInternal';

type UseTranslateResult = {
  t: Ref<TFnType<DefaultParamType, string, TranslationKey>>;
  isLoading: Ref<boolean>;
};

export const useTranslate = (namespaces?: NsFallback): UseTranslateResult => {
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
