import { useCallback } from 'react';
import { TFnType, getTranslateParams, DefaultParamType } from '@tolgee/core';

import { useTranslateInternal } from './useTranslateInternal';

export const useTranslate = (ns?: string[]) => {
  const tInternal = useTranslateInternal(ns);

  const t: TFnType<DefaultParamType, string> = useCallback(
    (...params: any) => {
      // @ts-ignore
      const props = getTranslateParams(...params);
      return tInternal(props);
    },
    [tInternal]
  );

  return t;
};
