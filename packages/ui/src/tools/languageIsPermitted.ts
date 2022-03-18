export const languageIsPermitted = (
  permittedLanguages: string[] | undefined,
  language: string
) => {
  return !permittedLanguages?.length || permittedLanguages.includes(language);
};
