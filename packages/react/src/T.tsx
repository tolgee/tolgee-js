import { NsType, TranslateParams, TranslationKey } from '@tolgee/web';
import React from 'react';
import { addReactKeys, wrapTagHandlers } from './tagsTools';
import { ParamsTags } from './types';

import { useTranslateInternal } from './useTranslateInternal';

type PropsWithKeyName = {
  params?: TranslateParams<ParamsTags>;
  children?: string;
  noWrap?: boolean;
  keyName: TranslationKey;
  ns?: NsType;
  defaultValue?: string;
  language?: string;
};

type PropsWithoutKeyName = {
  params?: TranslateParams<ParamsTags>;
  children: TranslationKey;
  noWrap?: boolean;
  ns?: NsType;
  defaultValue?: string;
  language?: string;
};

interface TInterface {
  (props: PropsWithKeyName): JSX.Element;
  (props: PropsWithoutKeyName): JSX.Element;
}

export const T: TInterface = (props) => {
  const key = (props as PropsWithKeyName).keyName || props.children;
  if (key === undefined) {
    // eslint-disable-next-line no-console
    console.error('T component: keyName not defined');
  }
  const defaultValue =
    props.defaultValue ||
    ((props as PropsWithKeyName).keyName ? props.children : undefined);

  const { t } = useTranslateInternal();

  const translation = addReactKeys(
    t({
      key: key!,
      params: wrapTagHandlers(props.params),
      defaultValue,
      noWrap: props.noWrap,
      ns: props.ns,
      language: props.language,
    })
  );

  return <>{translation}</>;
};
