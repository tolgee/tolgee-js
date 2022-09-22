import { derived, type Readable } from 'svelte/store';
import {
  getTranslateParams,
  type FallbackNSTranslation,
  type TFnType,
} from '@tolgee/core';
import getTranslateInternal from './getTranslateInternal';

const getTranslate = (namespaces?: FallbackNSTranslation) => {
  const { t: tInternal, isLoading } = getTranslateInternal(namespaces);

  const t = derived(tInternal, (value) => (...params) => {
    //@ts-ignore
    const props = getTranslateParams(...params);
    return value(props);
  }) as Readable<TFnType>;

  return { t, isLoading };
};

export default getTranslate;
