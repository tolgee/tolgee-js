import { TolgeeFormat, getTolgeeFormat } from '@tginternal/editor';

type Params = {
  text: string;
  keyIsPlural: boolean;
  icuPlaceholders: boolean | undefined;
};

export const getPluralForms = ({
  text,
  keyIsPlural,
  icuPlaceholders,
}: Params): TolgeeFormat | undefined => {
  if (!keyIsPlural) {
    return undefined;
  }
  const parsed = getTolgeeFormat(text, true, !icuPlaceholders);
  return parsed.parameter ? parsed : undefined;
};
