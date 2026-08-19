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

type ServerTProps = TProps & {
  locale?: string;
};

type ServerFunctionOptions = {
  locale?: string;
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

  const getTolgee = async ({ locale }: ServerFunctionOptions = {}) => {
    const resolvedLocale = locale ?? (await getLocale());
    const tolgee = await getTolgeeInstance(resolvedLocale);
    return tolgee;
  };

  const getTranslate = async ({ locale }: ServerFunctionOptions = {}) => {
    const tolgee = await getTolgee({ locale });
    return tolgee.t;
  };

  async function T({ locale, ...props }: ServerTProps) {
    const t = await getTranslate({ locale });
    return <TBase t={t as TFnType<ParamsTags>} {...props} />;
  }

  return {
    getTolgee,
    getTranslate,
    T,
  };
};
