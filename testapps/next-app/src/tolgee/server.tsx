// @ts-ignore
import { cache } from 'react';
import { useLocale } from 'next-intl';

import { TolgeeBase, ALL_LOCALES, getStaticData } from './shared';
import { ParamsTags, TProps } from './TBase/types';
import { TBase } from './TBase/TBase';
import { TFnType } from '@tolgee/web';

export const getTolgeeInstance = cache(async (locale: string) => {
  const tolgee = TolgeeBase().init({
    staticData: await getStaticData(ALL_LOCALES),
    observerOptions: {
      fullKeyEncode: true,
    },
    language: locale,
    fetch: async (input, init) => {
      const data = await fetch(input, { ...init, next: { revalidate: 0 } });
      return data;
    },
  });

  await tolgee.run();

  return tolgee;
});

export const getTolgee = async () => {
  const locale = useLocale();
  const tolgee = await getTolgeeInstance(locale);
  return tolgee;
};

export const getTranslate = async () => {
  const tolgee = await getTolgee();
  return tolgee.t;
};

export async function T(props: TProps) {
  const t = await getTranslate();
  return <TBase t={t as TFnType<ParamsTags>} {...props} />;
}
