import { ChangeTranslationInterface, KeyPosition } from '@tolgee/core';

import { KeyInScreenshot } from './useGallery';
import { LiveCredentials, resolveLiveCredential } from '../../../tools/auth';
import {
  MAX_LANGUAGES_SELECTED,
  PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY,
} from '../../../constants';
import { putBaseLangFirstTags } from '../languageHelpers';

// `/v2/api-keys/current-permissions` takes the project in the query rather than the path, and naming it is what a
// PAT and an unbound OAuth token need. A project key names its own project, and telling the server which project to
// answer for makes it answer for the account instead of the key, dropping the key's own restrictions.
export function permissionsQueryProjectId(
  credentials: LiveCredentials
): number | undefined {
  const { projectId, requiresExplicitProject } =
    resolveLiveCredential(credentials);
  if (!requiresExplicitProject || projectId === undefined) {
    return undefined;
  }
  return Number(projectId);
}

export function getPreferredLanguages(): string[] {
  try {
    return JSON.parse(
      localStorage.getItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY) || ''
    );
  } catch {
    return [];
  }
}

export function setPreferredLanguages(languages: string[]) {
  localStorage.setItem(
    PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY,
    JSON.stringify(languages)
  );
}

export function getInitialLanguages(available: string[], base?: string) {
  const preferred = getPreferredLanguages();
  let langs = preferred.filter((l) => available.includes(l));
  if (langs.length === 0) {
    langs = available;
  }
  return putBaseLangFirstTags(langs, base).slice(0, MAX_LANGUAGES_SELECTED);
}

export const changeInTolgeeCache = (
  key: string,
  ns: string | undefined,
  values: [language: string, value: string][],
  changeTranslation: ChangeTranslationInterface
) => {
  const changers = values.map(([language, value]) =>
    changeTranslation(
      {
        language,
        namespace: ns,
      },
      key,
      value || undefined
    )
  );
  return { revert: () => changers.forEach((ch) => ch.revert()) };
};

export function mapPosition({ position }: KeyInScreenshot) {
  return {
    x: position!.x,
    y: position!.y,
    width: position!.width,
    height: position!.height,
  };
}

export function scalePositionsToImg(
  windowSize: Size,
  imgSize: Size,
  positions: KeyPosition[]
) {
  const xChange = imgSize.width / windowSize.width;
  const yChange = imgSize.height / windowSize.height;
  return positions.map(({ position, ...data }) => ({
    ...data,
    position: {
      x: position.x * xChange,
      y: position.y * yChange,
      width: position.width * xChange,
      height: position.height * yChange,
    },
  }));
}

export type Size = {
  width: number;
  height: number;
};

export function getImgSize(url: string) {
  return new Promise<Size>((resolve) => {
    const img = document.createElement('img');
    img.src = url;
    img.onload = function () {
      const width = img.width;
      const height = img.height;
      resolve({ width, height });
    };
  });
}
