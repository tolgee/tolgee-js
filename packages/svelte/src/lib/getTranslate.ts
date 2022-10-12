import { derived, type Readable } from 'svelte/store';
import {
  getTranslateParams,
  type FallbackNsTranslation,
  type TFnType,
} from '@tolgee/web';
import getTranslateInternal from './getTranslateInternal';

const getTranslate = (ns?: FallbackNsTranslation) => {
  const { t: tInternal, isLoading } = getTranslateInternal(ns);

  const t = derived(tInternal, (value) => (...params) => {
    //@ts-ignore
    const props = getTranslateParams(...params);
    return value(props);
  }) as Readable<TFnType>;

  return { t, isLoading };
};

export default getTranslate;
