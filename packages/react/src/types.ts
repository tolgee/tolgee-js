import React from 'react';
import type {
  DefaultParamType,
  NsType,
  TFnType,
  TolgeeInstance,
  TranslateParams,
  TranslationKey,
} from '@tolgee/web';

export type ParamsTags =
  | DefaultParamType
  | ((value: any) => JSX.Element | React.ReactElement | null)
  | React.ReactNode;

export type ReactOptions = {
  useSuspense: boolean;
};

export type TolgeeReactContext = {
  tolgee: TolgeeInstance;
  options: ReactOptions;
};

interface PropsBase {
  params?: TranslateParams<ParamsTags>;
  noWrap?: boolean;
  ns?: NsType;
  defaultValue?: string;
  language?: string;
}

export interface PropsWithKeyName extends PropsBase {
  children?: string;
  keyName: TranslationKey;
}

export interface PropsWithoutKeyName extends PropsBase {
  children: TranslationKey;
}

export type TProps = PropsWithKeyName | PropsWithoutKeyName;

export interface TBaseInterface {
  (props: TProps & { t: TFnType<ParamsTags> }): JSX.Element;
}
