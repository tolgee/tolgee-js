import { createUrl } from '../../tools/url';

export function isUrlValid(url: string) {
  try {
    const result = createUrl(url);
    return result instanceof URL;
  } catch (e) {
    return false;
  }
}
