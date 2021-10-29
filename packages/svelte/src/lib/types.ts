import type { Readable } from 'svelte/store';

export type TranslationParameters = { [key: string]: string };

export type GetTranslateResultFnProps = {
  key: string;
  parameters?: TranslationParameters;
  noWrap?: boolean;
  defaultValue?: string;
};

export type GetTranslateType = () => Readable<{
  (props: GetTranslateResultFnProps): string;
  (
    key: string,
    parameters?: TranslationParameters,
    noWrap?: boolean,
    defaultValue?: string
  ): string;
}>;
