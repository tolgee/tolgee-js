import type { DefaultParamType, TolgeeInstance } from '@tolgee/web';
import React from 'react';

export type ParamsTags =
  | DefaultParamType
  | ((value: any) => JSX.Element | React.ReactElement | null)
  | React.ReactNode;

export type ReactOptions = {
  useSuspense: boolean;
};

export type TolgeeReactContext = {
  tolgee: TolgeeInstance;
  options: ReactOptions;
};
