export function getHeaderLanguages(headers: Headers) {
  const acceptLanguageHeader = headers.get('Accept-Language');
  if (!acceptLanguageHeader) {
    return [];
  }
  // Split the header into locales based on commas
  const locales = acceptLanguageHeader.split(',').map((locale) => {
    // Remove whitespace and split by ';' to get only the locale part
    const [localePart] = locale.trim().split(';');
    return localePart;
  });

  // Filter out any empty strings and return the unique locales
  return [...new Set(locales.filter((locale) => locale && locale !== '*'))];
}
