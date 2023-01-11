import { derived, type Readable } from 'svelte/store';
import { getTranslateProps, type NsFallback, type TFnType } from '@tolgee/web';
import getTranslateInternal from './getTranslateInternal';

const getTranslate = (ns?: NsFallback) => {
  const { t: tInternal, isLoading } = getTranslateInternal(ns);

  const t = derived(tInternal, (value) => (...params) => {
    //@ts-ignore
    const props = getTranslateProps(...params);
    return value(props);
  }) as Readable<TFnType>;

  return { t, isLoading: isLoading as Readable<boolean> };
};

export default getTranslate;
