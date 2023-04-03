import { derived, type Readable } from 'svelte/store';
import {
  getTranslateProps,
  type DefaultParamType,
  type NsFallback,
  type TFnType,
  type TranslationKey,
} from '@tolgee/web';
import getTranslateInternal from './getTranslateInternal';

type UseTranslateResult = {
  t: Readable<TFnType<DefaultParamType, string, TranslationKey>>;
  isLoading: Readable<boolean>;
};

const getTranslate = (ns?: NsFallback): UseTranslateResult => {
  const { t: tInternal, isLoading } = getTranslateInternal(ns);

  const t = derived(tInternal, (value) => (...params) => {
    //@ts-ignore
    const props = getTranslateProps(...params);
    return value(props);
  }) as Readable<TFnType>;

  return { t, isLoading: isLoading as Readable<boolean> };
};

export default getTranslate;
