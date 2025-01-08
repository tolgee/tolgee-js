// @ts-ignore
import { cache } from 'react';
import React from 'react';
import { TFnType } from '@tolgee/web';
import { TolgeeInstance } from '@tolgee/web';

import { TBase } from './TBase';
import { TProps, ParamsTags } from './types';

export type CreateServerInstanceOptions = {
  createTolgee: (locale: string) => Promise<TolgeeInstance>;
  getLocale: () => Promise<string>;
};

export const createServerInstance = ({
  createTolgee,
  getLocale,
}: CreateServerInstanceOptions) => {
  const getTolgeeInstance: (locale: string) => Promise<TolgeeInstance> = cache(
    async (locale: string) => {
      const tolgee = await createTolgee(locale);
      await tolgee.run();
      return tolgee;
    }
  );

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

  return {
    getTolgee,
    getTranslate,
    T,
  };
};
