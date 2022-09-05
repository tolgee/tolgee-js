import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TranslationParams, ListenerSelective } from '@tolgee/core';

import { useTolgeeContext } from './useTolgeeContext';
import { addReactKeys, wrapTagHandlers } from './tagsTools';
import { ParamsTags } from './types';

export type TranslationTags<T> = string | T[];

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

  const forceRerender = useCallback(() => {
    setInstance((v) => v + 1);
  }, [setInstance]);

  const subscriptionRef = useRef(null as ListenerSelective);

  const subscriptionQueue = useRef([] as string[]);

  const subscribeToKey = (key: string) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.subscribeToKey(key);
    } else {
      subscriptionQueue.current.push(key);
    }
  };

  useEffect(() => {
    subscriptionRef.current = tolgee.on('keyUpdate', () => {
      forceRerender();
    });
    subscriptionQueue.current.forEach((key) =>
      subscriptionRef.current.subscribeToKey(key)
    );
    subscriptionQueue.current = [];
    return () => {
      subscriptionRef.current.unsubscribe();
    };
  }, []);

  const getTranslation = useCallback(
    (
      key: string,
      params?: ParamsTags,
      noWrap?: boolean,
      defaultValue?: string
    ) => {
      subscribeToKey(key);
      const translation = tolgee.instant({
        key,
        params: wrapTagHandlers(params),
        noWrap,
        defaultValue: defaultValue,
      });

      return translation;
    },
    [tolgee]
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
