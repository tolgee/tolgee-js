export type TranslationParameters = { [key: string]: string };

export type TranslationsStateKey = {
  source: string;
  parameters: TranslationParameters;
  noWrap: boolean;
};
