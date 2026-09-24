import { ChangeTranslationInterface, KeyPosition } from '@tolgee/core';

import { KeyInScreenshot } from './useGallery';
import { LiveCredentials, resolveLiveCredential } from '../../../tools/auth';
import {
  MAX_LANGUAGES_SELECTED,
  PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY,
} from '../../../constants';
import { putBaseLangFirstTags } from '../languageHelpers';
import type { TolgeeFormat } from '@tginternal/editor';
import type { Disposition } from './usePermissions';

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

export type SubmitKind = 'save' | 'suggest' | 'saveAndSuggest';

type SubmitField = {
  language: string;
  disposition: Disposition;
  changed: boolean;
  isEmpty: boolean;
};

export function planSubmit({
  fields,
  suggestOnly,
  pluralChanged,
}: {
  fields: SubmitField[];
  suggestOnly: boolean;
  pluralChanged?: boolean;
}) {
  const changedFields = fields.filter((f) => f.changed);
  const suggested = changedFields.filter((f) => f.disposition === 'suggest');
  // the server has no "suggest removing the translation"
  const toSuggest = suggested.filter((f) => !f.isEmpty).map((f) => f.language);
  const cleared = suggested.filter((f) => f.isEmpty).map((f) => f.language);
  // A language the form did not touch must stay out of the update: the server writes any value that
  // differs from the stored one, so sending back what this dialog loaded overwrites whatever someone
  // else saved in the meantime. Switching the key's plural shape rewrites the ICU of every field
  // without touching its variants, so it counts as a change to all of them.
  const toSave = (pluralChanged ? fields : changedFields)
    .filter((f) => f.disposition === 'save')
    .map((f) => f.language);

  let kind: SubmitKind = 'save';
  if (toSuggest.length) {
    kind = toSave.length ? 'saveAndSuggest' : 'suggest';
  } else if (suggestOnly) {
    kind = 'suggest';
  }
  return { toSuggest, toSave, cleared, kind };
}

type EditCapabilities = {
  canEditTags: boolean;
  canUploadScreenshots: boolean;
  canDeleteScreenshots: boolean;
  canEditTranslation: (language: string) => unknown;
  canEditState: (language: string) => unknown;
  canSuggestTranslation: (language: string) => boolean;
};

export function isSuggestOnly(
  permissions: EditCapabilities,
  languages: string[]
) {
  return (
    !permissions.canEditTags &&
    !permissions.canUploadScreenshots &&
    !permissions.canDeleteScreenshots &&
    !languages.some(
      (l) => permissions.canEditTranslation(l) || permissions.canEditState(l)
    ) &&
    languages.some((l) => permissions.canSuggestTranslation(l))
  );
}

export function keepFormFields<T>(
  fetched: Record<string, T>,
  current: Record<string, T>,
  keep: string[]
) {
  const result = { ...fetched };
  keep.forEach((language) => {
    if (language in current && language in fetched) {
      result[language] = current[language];
    }
  });
  return result;
}

export function sameTranslation(
  a: TolgeeFormat | undefined,
  b: TolgeeFormat | undefined
) {
  const nonEmpty = (v: TolgeeFormat | undefined) =>
    Object.entries(v?.variants ?? {})
      .filter(([, text]) => text)
      .sort(([x], [y]) => x.localeCompare(y));
  return JSON.stringify(nonEmpty(a)) === JSON.stringify(nonEmpty(b));
}
