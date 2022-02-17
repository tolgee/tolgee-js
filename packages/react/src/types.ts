import { TranslationParamsTags } from '@tolgee/core';

export type ParamsTags = {
  [key: string]:
    | TranslationParamsTags<React.ReactNode>['a']
    | React.ReactElement;
};
