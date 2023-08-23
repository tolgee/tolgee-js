import { TranslateParams } from '@tolgee/web';
import React from 'react';

import { ParamsTags } from './types';

export const wrapTagHandlers = (
  params: TranslateParams<ParamsTags> | undefined
) => {
  if (!params) {
    return undefined;
  }

  const result: any = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value === 'function') {
      result[key] = (chunk: any) => {
        return value(addReactKeys(chunk));
      };
    } else if (React.isValidElement(value as any)) {
      const el = value as React.ReactElement;
      result[key] = (chunk: any) => {
        return el.props.children === undefined && chunk?.length
          ? React.cloneElement(el, {}, addReactKeys(chunk))
          : React.cloneElement(el);
      };
    } else {
      result[key] = value;
    }
  });

  return result;
};

export const addReactKeys = (
  val: React.ReactNode | React.ReactNode[] | undefined
) => {
  if (Array.isArray(val)) {
    return React.Children.toArray(val);
  } else {
    return val;
  }
};
