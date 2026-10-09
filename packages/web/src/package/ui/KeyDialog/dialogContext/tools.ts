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
import {
  StateInType,
  STATES_FOR_UPDATE,
  StateType,
} from '../State/translationStates';
import type { components } from '../../client/apiSchema.generated';

type TranslationState = components['schemas']['TranslationModel']['state'];

export const SUGGESTIONS_URL =
  '/v2/projects/languages/{languageId}/key/{keyId}/suggestion';

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

export function editedLanguages(
  fields: { language: string; changed: boolean; stateChanged: boolean }[],
  pluralChanged: boolean
) {
  return fields
    .filter((f) => pluralChanged || f.changed || f.stateChanged)
    .map((f) => f.language);
}

export function planSubmit({
  fields,
  suggestOnly,
  pluralChanged,
  otherKeyChanges = false,
}: {
  fields: SubmitField[];
  suggestOnly: boolean;
  pluralChanged?: boolean;
  otherKeyChanges?: boolean;
}) {
  const changedFields = fields.filter((f) => f.changed);
  const suggested = changedFields.filter((f) => f.disposition === 'suggest');
  // the server has no "suggest removing the translation"
  const toSuggest = suggested.filter((f) => !f.isEmpty).map((f) => f.language);
  const cleared = suggested.filter((f) => f.isEmpty).map((f) => f.language);
  // The server writes any value that differs from the stored one, so a field the form did not touch is
  // sent back only when the plural switch rewrote its ICU; otherwise it would overwrite what someone
  // else saved meanwhile.
  const toSave = (pluralChanged ? fields : changedFields)
    .filter((f) => f.disposition === 'save')
    .map((f) => f.language);

  const keyIsAlsoUpdated =
    toSave.length > 0 || (otherKeyChanges && !suggestOnly);
  let kind: SubmitKind = 'save';
  if (toSuggest.length) {
    kind = keyIsAlsoUpdated ? 'saveAndSuggest' : 'suggest';
  } else if (suggestOnly) {
    kind = 'suggest';
  }
  return { toSuggest, toSave, cleared, kind };
}

export function statesToUpdate(
  fields: { language: string; state: StateType; stateChanged: boolean }[],
  canEditState: (language: string) => boolean
) {
  const states: Record<string, StateInType> = {};
  fields.forEach(({ language, state, stateChanged }) => {
    if (
      stateChanged &&
      STATES_FOR_UPDATE.includes(state) &&
      canEditState(language)
    ) {
      states[language] = state as StateInType;
    }
  });
  return states;
}

export function keyUpdateCarriesOtherChanges({
  tags,
  serverTags,
  screenshotsAdded,
  screenshotsRemoved,
  maxCharLimit,
  serverMaxCharLimit,
  pluralChanged,
  states,
}: {
  tags: string[] | undefined;
  serverTags: string[];
  screenshotsAdded: number;
  screenshotsRemoved: number;
  maxCharLimit: number | null | undefined;
  serverMaxCharLimit: number | null | undefined;
  pluralChanged: boolean;
  states: Record<string, unknown>;
}) {
  const tagsChanged =
    tags !== undefined &&
    (tags.length !== serverTags.length ||
      tags.some((t) => !serverTags.includes(t)));
  return (
    tagsChanged ||
    screenshotsAdded > 0 ||
    screenshotsRemoved > 0 ||
    (maxCharLimit ?? 0) !== (serverMaxCharLimit ?? 0) ||
    pluralChanged ||
    Object.keys(states).length > 0
  );
}

type EditCapabilities = {
  canEditTags: boolean;
  canUploadScreenshots: boolean;
  canDeleteScreenshots: boolean;
  canEditTranslation: (language: string) => boolean;
  canEditState: (language: string) => boolean;
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

export function deriveFieldStates({
  languages,
  states,
  formDisabled,
  getDisposition,
  credentialBlocksTranslation,
}: {
  languages: string[];
  states: Record<string, TranslationState | undefined>;
  formDisabled: boolean;
  getDisposition: (
    language: string,
    state: TranslationState | undefined
  ) => Disposition;
  credentialBlocksTranslation: (
    language: string,
    state: TranslationState | undefined
  ) => boolean | undefined;
}) {
  const dispositions: Record<string, Disposition> = {};
  const credentialBlocksField: Record<string, boolean> = {};
  languages.forEach((language) => {
    const state = states[language];
    const lockedElsewhere = formDisabled || state === 'DISABLED';
    dispositions[language] = lockedElsewhere
      ? 'readonly'
      : getDisposition(language, state);
    credentialBlocksField[language] =
      !lockedElsewhere && credentialBlocksTranslation(language, state) === true;
  });
  return { dispositions, credentialBlocksField };
}
