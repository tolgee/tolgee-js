import { useCallback } from 'react';
import {
  TFnType,
  getTranslateProps,
  DefaultParamType,
  TranslationKey,
} from '@tolgee/web';

import { useTranslateInternal } from './useTranslateInternal';
import { ReactOptions } from './types';

export interface UseTranslateResult {
  t: TFnType<DefaultParamType, string, TranslationKey>;
  isLoading: boolean;
}

export const useTranslate = (
  ns?: string[] | string,
  options?: ReactOptions
): UseTranslateResult => {
  const { t: tInternal, isLoading } = useTranslateInternal(ns, options);

  const t = useCallback(
    (...params: any) => {
      // @ts-ignore
      const props = getTranslateProps(...params);
      return tInternal(props);
    },
    [tInternal]
  );

  return { t, isLoading };
};
