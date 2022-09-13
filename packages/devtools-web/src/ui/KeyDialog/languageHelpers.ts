import { components } from '../client/apiSchema.generated';

type LanguageModel = components['schemas']['LanguageModel'];

export const putBaseLangFirst = (languages: LanguageModel[] | undefined) => {
  const base = languages?.find((l) => l.base);
  if (base) {
    return [base, ...(languages || []).filter((val) => val !== base)];
  }
  return languages;
};

export const putBaseLangFirstTags = (strings: Array<string>, base?: string) => {
  if (base && strings.includes(base)) {
    return [base, ...strings.filter((val) => val !== base)];
  }
  return strings;
};
