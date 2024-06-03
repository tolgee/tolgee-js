// @ts-ignore
import { cache } from 'react';
import { TFnType } from '@tolgee/web';

import { TBase } from './TBase';
import { TProps, ParamsTags } from './types';
import React from 'react';
import { TolgeeInstance } from '@tolgee/web';

export type CreateServerInstanceOptions = {
  createTolgee: (locale: string) => Promise<TolgeeInstance>;
  getLocale: () => Promise<string>;
};

export const createServerInstance = ({
  createTolgee,
  getLocale,
}: CreateServerInstanceOptions) => {
  const getTolgeeInstance = cache(async (locale: string) => {
    const tolgee = await createTolgee(locale);
    await tolgee.run();
    return tolgee;
  }) as (locale: string) => Promise<TolgeeInstance>;

  const getTolgee = async () => {
    const locale = await getLocale();
    const tolgee = await getTolgeeInstance(locale);
    return tolgee;
  };

  const getTranslate = async () => {
    const tolgee = await getTolgee();
    return tolgee.t;
  };

  async function T(props: TProps) {
    const t = await getTranslate();
    return <TBase t={t as TFnType<ParamsTags>} {...props} />;
  }

  return { getTolgeeInstance, getTolgee, getTranslate, T };
};
