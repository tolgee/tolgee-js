import { Tolgee, TranslationParams } from '@tolgee/core';

export type TranslateFnProps = {
  key: string;
  parameters?: TranslationParams;
  noWrap?: boolean;
  defaultValue?: string;
};

export type TolgeeContext = {
  tolgee: Tolgee;
};
