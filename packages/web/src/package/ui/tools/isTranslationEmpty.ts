import { TolgeeFormat } from '@tginternal/editor';

export function isTranslationEmpty(
  value: TolgeeFormat | undefined,
  isPlural: boolean
) {
  if (!value) {
    return true;
  }
  if (isPlural) {
    return !Object.values(value.variants).join('');
  } else {
    return !value.variants.other;
  }
}
