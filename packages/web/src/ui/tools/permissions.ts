export function isAuthorizedTo(scope: string, scopes: string[] | undefined) {
  return Boolean(scopes?.includes(scope));
}

export const isLanguagePermitted = (
  languageId: number | undefined,
  permittedLanguages: number[] | undefined
) => {
  if (!permittedLanguages?.length) {
    return true;
  }
  return permittedLanguages.includes(languageId as number);
};
