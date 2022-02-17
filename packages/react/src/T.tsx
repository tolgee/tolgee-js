import * as React from 'react';
import { FunctionComponent } from 'react';
import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '@tolgee/core';
import { ParamsTags } from './types';
import { useTranslate } from './useTranslate';

type TProps = {
  parameters?: ParamsTags;
  children?: string;
  /**
   * @deprecated Use strategy 'NO_WRAP' instead
   */
  noWrap?: boolean;
  strategy?: 'ELEMENT_WRAP' | 'TEXT_WRAP' | 'NO_WRAP';
  keyName?: string;
};

export const T: FunctionComponent<TProps> = (props: TProps) => {
  const strategy =
    props.noWrap === true ? 'NO_WRAP' : props.strategy || 'ELEMENT_WRAP';

  const key = props.keyName || props.children;
  if (!key) {
    // eslint-disable-next-line no-console
    console.error('T component: keyName not defined');
  }
  const defaultValue = props.keyName ? props.children : undefined;

  const translateFnNoWrap =
    strategy === 'ELEMENT_WRAP' || strategy === 'NO_WRAP';

  const t = useTranslate();

  const translation = t({
    key,
    parameters: props.parameters,
    defaultValue,
    noWrap: translateFnNoWrap,
  });

  if (strategy === 'ELEMENT_WRAP') {
    return (
      <span {...{ [TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE]: key }}>
        {translation}
      </span>
    );
  }

  return <>{translation}</>;
};
