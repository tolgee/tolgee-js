import { createUrl } from '../../../tools/url';

export const getAvatarUrl = (
  thumbnail: string | undefined,
  apiUrl: string | undefined
) => {
  if (!thumbnail) {
    return undefined;
  }
  try {
    return new URL(thumbnail, createUrl(apiUrl ?? '')).href;
  } catch {
    return undefined;
  }
};
