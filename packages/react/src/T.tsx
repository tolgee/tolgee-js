import React from 'react';
import { ParamsTags, TProps } from './types';

import { useTranslateInternal } from './useTranslateInternal';
import { TFnType } from '@tolgee/web';
import { TBase } from './TBase';

export const T = (props: TProps): React.ReactElement => {
  const { t } = useTranslateInternal();

  return <TBase t={t as TFnType<ParamsTags>} {...props} />;
};
