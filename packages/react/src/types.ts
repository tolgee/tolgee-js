import { DefaultParamType } from '@tolgee/core';
import React from 'react';

export type ParamsTags =
  | DefaultParamType
  | ((value: any) => JSX.Element | React.ReactElement | null)
  | React.ReactNode;
