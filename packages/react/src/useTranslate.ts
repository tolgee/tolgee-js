import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TranslationTags, TranslationParams } from '@tolgee/core';

import { useTolgeeContext } from './useTolgeeContext';
import { addReactKeys, wrapTagHandlers } from './tagsTools';
import { ParamsTags } from './types';

type UseTranslateResultFnProps<T extends TranslationParams | ParamsTags> = {
  key: string;
  parameters?: T;
  noWrap?: boolean;
  defaultValue?: string;
};

type ReturnFnType = {
  <T extends TranslationParams | ParamsTags = TranslationParams>(
    props: UseTranslateResultFnProps<T>
  ): T extends TranslationParams ? string : TranslationTags<React.ReactNode>;

  (key: string, defaultValue?: string, noWrap?: boolean): string;

  <T extends TranslationParams | ParamsTags = TranslationParams>(
    key: string,
    defaultValue?: string,
    parameters?: T
  ): T extends TranslationParams ? string : TranslationTags<React.ReactNode>;

  <T extends TranslationParams | ParamsTags = TranslationParams>(
    key: string,
    parameters?: T,
    defaultValue?: string
  ): T extends TranslationParams ? string : TranslationTags<React.ReactNode>;

  <T extends TranslationParams | ParamsTags = TranslationParams>(
    key: string,
    parameters?: T,
    noWrap?: boolean,
    defaultValue?: string
  ): T extends TranslationParams ? string : TranslationTags<React.ReactNode>;
};

export const useTranslate: () => ReturnFnType = () => {
  const { tolgee } = useTolgeeContext();

  // dummy state to enable re-rendering
  const [instance, setInstance] = useState(0);

  const forceRerender = () => {
    setInstance((v) => v + 1);
  };

  // cache of translations translated with this useTranslate
  const keysRef = useRef<string[]>([]);

  const resetMemory = () => {
    keysRef.current = [];
  };

  useEffect(() => {
    const subscription = tolgee.onTranslationChange.subscribe(({ key }) => {
      if (keysRef.current.includes(key)) {
        forceRerender();
      }
    });
    return () => subscription.unsubscribe();
  }, [tolgee]);

  useEffect(() => {
    const subscription = tolgee.onLangLoaded.subscribe(() => {
      if (keysRef.current.length) {
        resetMemory();
        forceRerender();
      }
    });
    return () => subscription.unsubscribe();
  }, [tolgee]);

  const getTranslation = useCallback(
    (
      key: string,
      params?: ParamsTags,
      noWrap?: boolean,
      defaultValue?: string
    ) => {
      const translation = tolgee.instant({
        key,
        params: wrapTagHandlers(params),
        noWrap,
        defaultValue: defaultValue,
      });

      const firstRender = !keysRef.current.includes(key);
      if (firstRender) {
        keysRef.current.push(key);
        tolgee.translate({
          key,
          params: wrapTagHandlers(params),
          noWrap,
          defaultValue,
        });
      }

      return translation;
    },
    [tolgee, keysRef]
  );

  const t: ReturnFnType = useCallback(
    (keyOrProps, ...params: (ParamsTags | boolean | string)[]) => {
      let parameters: ParamsTags = undefined;
      let noWrap: boolean = undefined;
      let defaultValue = undefined;
      // allow user to pass object of params and make the code cleaner
      const key = typeof keyOrProps === 'object' ? keyOrProps.key : keyOrProps;
      if (typeof keyOrProps === 'object') {
        parameters = keyOrProps.parameters;
        noWrap = keyOrProps.noWrap;
        defaultValue = keyOrProps.defaultValue;
      } else {
        params.forEach((param) => {
          switch (typeof param) {
            case 'object':
              parameters = param;
              break;
            case 'boolean':
              noWrap = param;
              break;
            case 'string':
              defaultValue = param;
          }
        });
      }

      return addReactKeys(
        getTranslation(key, parameters, noWrap, defaultValue)
      ) as any;
    },
    [getTranslation, instance]
  );

  return t;
};
