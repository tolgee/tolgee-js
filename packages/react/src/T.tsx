import { NsType, TranslateParams } from '@tolgee/web';
import React, { FunctionComponent } from 'react';
import { addReactKeys, wrapTagHandlers } from './tagsTools';

import { ParamsTags } from './types';
import { useTranslateInternal } from './useTranslateInternal';

type TProps = {
  params?: TranslateParams<ParamsTags>;
  children?: string;
  noWrap?: boolean;
  keyName?: string;
  ns?: NsType;
  defaultValue?: string;
};

export const T: FunctionComponent<TProps> = (props: TProps) => {
  const key = props.keyName || props.children;
  if (key === undefined) {
    // eslint-disable-next-line no-console
    console.error('T component: keyName not defined');
  }
  const defaultValue =
    props.defaultValue || (props.keyName ? props.children : undefined);

  const { t } = useTranslateInternal();

  const translation = addReactKeys(
    t({
      key: key!,
      params: wrapTagHandlers(props.params),
      defaultValue,
      noWrap: props.noWrap,
      ns: props.ns,
    })
  );

  return <>{translation}</>;
};
