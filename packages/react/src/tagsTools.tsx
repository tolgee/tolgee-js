import { TranslateParams } from '@tolgee/web';
import React from 'react';

import { ParamsTags } from './types';

function unwrapSingleElementArray(value: any) {
  if (Array.isArray(value) && value.length === 1) {
    return value[0];
  } else {
    return value;
  }
}

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
  children: React.ReactNode | React.ReactNode[] | undefined
) => {
  const val = unwrapSingleElementArray(children);
  if (Array.isArray(val)) {
    return val.map((item, i) => (
      <React.Fragment key={i}>{item}</React.Fragment>
    ));
  } else {
    return val;
  }
};
