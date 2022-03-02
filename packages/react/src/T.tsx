import React, { FunctionComponent } from 'react';

import { ParamsTags } from './types';
import { useTranslate } from './useTranslate';

type TProps = {
  parameters?: ParamsTags;
  children?: string;
  noWrap?: boolean;
  /**
   * @deprecated Use noWrap to disable in-context wrapping
   */
  strategy?: 'ELEMENT_WRAP' | 'TEXT_WRAP' | 'NO_WRAP';
  keyName?: string;
};

export const T: FunctionComponent<TProps> = (props: TProps) => {
  const key = props.keyName || props.children;
  if (!key) {
    // eslint-disable-next-line no-console
    console.error('T component: keyName not defined');
  }
  const defaultValue = props.keyName ? props.children : undefined;

  const t = useTranslate();

  const translation = t({
    key,
    parameters: props.parameters,
    defaultValue,
    noWrap: props.noWrap,
  });

  return <>{translation}</>;
};
