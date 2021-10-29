import { Tolgee } from '@tolgee/core';

export type TranslationParameters = { [key: string]: string };

export type TranslateFnProps = {
  key: string;
  parameters?: TranslationParameters;
  noWrap?: boolean;
  defaultValue?: string;
};

export type TolgeeContext = {
  tolgee: Tolgee;
};
