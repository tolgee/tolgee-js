import React, { Suspense, useEffect, useState } from 'react';
import { TolgeeInstance, TolgeeStaticDataProp } from '@tolgee/web';
import { ReactOptions, TolgeeReactContext } from './types';
import { useTolgeeSSR } from './useTolgeeSSR';

export const DEFAULT_REACT_OPTIONS: ReactOptions = {
  useSuspense: false,
};

let ProviderInstance: React.Context<TolgeeReactContext | undefined>;

export const getProviderInstance = () => {
  if (!ProviderInstance) {
    ProviderInstance = React.createContext<TolgeeReactContext | undefined>(
      undefined
    );
  }

  return ProviderInstance;
};

let LAST_TOLGEE_INSTANCE: TolgeeInstance | undefined = undefined;

export type SSROptions = {
  /**
   * Hard set language to this value, use together with `staticData`
   */
  language?: string;
  /**
   * If provided, static data will be hard set to Tolgee cache for initial render
   */
  staticData?: TolgeeStaticDataProp;
};

export interface TolgeeProviderProps {
  children?: React.ReactNode;
  tolgee: TolgeeInstance;
  options?: ReactOptions;
  fallback?: React.ReactNode;
  /**
   * use this option if you use SSR
   *
   * You can pass staticData and language
   * which will be set to tolgee instance for the initial render
   *
   * Don't switch between ssr and non-ssr dynamically
   */
  ssr?: SSROptions | boolean;
}

export const TolgeeProvider: React.FC<TolgeeProviderProps> = ({
  tolgee,
  options,
  children,
  fallback,
  ssr,
}) => {
  // prevent restarting tolgee unnecesarly
  // however if the instance change on hot-reloading
  // we want to restart
  useEffect(() => {
    if (LAST_TOLGEE_INSTANCE?.run !== tolgee.run) {
      if (LAST_TOLGEE_INSTANCE) {
        LAST_TOLGEE_INSTANCE.stop();
      }
      LAST_TOLGEE_INSTANCE = tolgee;
      tolgee
        .run()
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tolgee]);

  let tolgeeSSR = tolgee;

  const { language, staticData } = (
    typeof ssr !== 'object' ? {} : ssr
  ) as SSROptions;
  tolgeeSSR = useTolgeeSSR(tolgee, language, staticData, Boolean(ssr));

  const [loading, setLoading] = useState(!tolgeeSSR.isLoaded());

  const optionsWithDefault = { ...DEFAULT_REACT_OPTIONS, ...options };

  const TolgeeProviderContext = getProviderInstance();

  if (optionsWithDefault.useSuspense) {
    return (
      <TolgeeProviderContext.Provider
        value={{ tolgee: tolgeeSSR, options: optionsWithDefault }}
      >
        {loading ? (
          fallback
        ) : (
          <Suspense fallback={fallback || null}>{children}</Suspense>
        )}
      </TolgeeProviderContext.Provider>
    );
  }

  return (
    <TolgeeProviderContext.Provider
      value={{ tolgee: tolgeeSSR, options: optionsWithDefault }}
    >
      {loading ? fallback : children}
    </TolgeeProviderContext.Provider>
  );
};
