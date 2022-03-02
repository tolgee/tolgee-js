import type { TranslationParams } from '@tolgee/core';
import type { Readable } from 'svelte/store';

export type GetTranslateResultFnProps = {
  key: string;
  parameters?: TranslationParams;
  noWrap?: boolean;
  defaultValue?: string;
};

export type GetTranslateType = () => Readable<{
  (props: GetTranslateResultFnProps): string;

  (key: string, defaultValue?: string, noWrap?: boolean): string;

  (key: string, defaultValue?: string, parameters?: TranslationParams): string;

  (key: string, parameters?: TranslationParams, defaultValue?: string): string;

  (
    key: string,
    parameters?: TranslationParams,
    noWrap?: boolean,
    defaultValue?: string
  ): string;
}>;
