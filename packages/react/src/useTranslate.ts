import { useCallback } from 'react';
import { TFnType, getTranslateProps, DefaultParamType } from '@tolgee/web';

import { useTranslateInternal } from './useTranslateInternal';
import { ReactOptions } from './types';

export const useTranslate = <KeyType extends string = string>(
  ns?: string[] | string,
  options?: ReactOptions
) => {
  const { t: tInternal, isLoading } = useTranslateInternal(ns, options);

  const t: TFnType<DefaultParamType, string, KeyType> = useCallback(
    (...params: any) => {
      // @ts-ignore
      const props = getTranslateProps(...params);
      return tInternal(props);
    },
    [tInternal]
  );

  return { t, isLoading };
};
