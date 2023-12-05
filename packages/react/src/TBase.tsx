import React from 'react';
import { addReactKeys, wrapTagHandlers } from './tagsTools';
import type { PropsWithKeyName, TBaseInterface } from './types';

export const TBase: TBaseInterface = (props) => {
  const key = (props as PropsWithKeyName).keyName || props.children;
  if (key === undefined) {
    // eslint-disable-next-line no-console
    console.error('T component: keyName not defined');
  }
  const defaultValue =
    props.defaultValue ||
    ((props as PropsWithKeyName).keyName ? props.children : undefined);

  const translation = addReactKeys(
    props.t({
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
