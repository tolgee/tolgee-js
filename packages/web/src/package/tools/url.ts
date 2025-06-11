function composeUrl(base: string, path: string): string {
  // Ensure the base URL does not end with a slash
  base = base.replace(/\/+$/, '');
  // Ensure the path does not start with a slash
  path = path.replace(/^\/+/, '');
  // Combine the two parts with a single slash in between
  return `${base}/${path}`;
}

export function joinUrls(...parts: string[]): string {
  let result = parts[0];
  parts.slice(1).forEach((part) => {
    result = composeUrl(result, part);
  });
  return result;
}

export function createUrl(...parts: string[]): URL {
  try {
    const base =
      typeof window === 'undefined' ? undefined : window.location.origin;
    return new URL(joinUrls(...parts), base);
  } catch (e) {
    // there might be a weird value in `base`
    // https://github.com/tolgee/tolgee-js/issues/3458
    return new URL(joinUrls(...parts));
  }
}
