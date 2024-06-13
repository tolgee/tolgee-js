export function isUrlValid(url: string) {
  try {
    const result = new URL(url);
    return result instanceof URL;
  } catch (e) {
    return false;
  }
}
