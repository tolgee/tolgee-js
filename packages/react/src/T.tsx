import React from 'react';
import { ParamsTags, TProps } from './types';

import { useTranslateInternal } from './useTranslateInternal';
import { TFnType } from '@tolgee/web';
import { TBase } from './TBase';

interface TInterface {
  (props: TProps): JSX.Element;
}

export const T: TInterface = (props) => {
  const { t } = useTranslateInternal();

  return <TBase t={t as TFnType<ParamsTags>} {...props} />;
};
