import { TranslationParams } from '@tolgee/core';
import React from 'react';

export type ParamsTags = {
  [key: string]:
    | TranslationParams['a']
    | ((value: any) => JSX.Element | React.ReactElement | null)
    | React.ReactElement;
};
