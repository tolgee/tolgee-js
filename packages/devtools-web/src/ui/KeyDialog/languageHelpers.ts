type LanguageModel = {
  base: string;
};

export const putBaseLangFirst = (languages: LanguageModel[] | undefined) => {
  const base = languages?.find((l) => l.base);
  if (base) {
    return [base, ...languages.filter((val) => val !== base)];
  }
  return languages;
};

export const putBaseLangFirstTags = (strings: Set<string>, base?: string) => {
  if (base && strings.has(base)) {
    return new Set([
      base,
      ...Array.from(strings).filter((val) => val !== base),
    ]);
  }
  return strings;
};
