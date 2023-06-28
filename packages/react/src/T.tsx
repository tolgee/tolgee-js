import { NsType, TranslateParams, TranslationKey } from '@tolgee/web';
import React from 'react';
import { addReactKeys, wrapTagHandlers } from './tagsTools';
import { ParamsTags } from './types';

import { useTranslateInternal } from './useTranslateInternal';

interface PropsBase {
  params?: TranslateParams<ParamsTags>;
  noWrap?: boolean;
  ns?: NsType;
  defaultValue?: string;
  language?: string;
}

interface PropsWithKeyName extends PropsBase {
  children?: string;
  keyName: TranslationKey;
}

interface PropsWithoutKeyName extends PropsBase {
  children: TranslationKey;
}

export type TProps = PropsWithKeyName | PropsWithoutKeyName;

interface TInterface {
  (props: TProps): JSX.Element;
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
