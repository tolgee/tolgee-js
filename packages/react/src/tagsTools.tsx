import React from 'react';

import { ParamsTags } from './types';

export const wrapTagHandlers = (params: ParamsTags) => {
  if (!params) {
    return undefined;
  }

  const result: any = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value === 'function') {
      result[key] = (chunk) => {
        return value(addReactKeys(chunk));
      };
    } else if (React.isValidElement(value)) {
      const el = value as React.ReactElement;
      result[key] = (chunk) => {
        return {
          ...el,
          props: {
            ...el.props,
            children:
              el.props.children !== undefined
                ? el.props.children
                : addReactKeys(chunk),
          },
        };
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
