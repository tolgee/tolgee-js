import React, { Suspense, useEffect, useState } from 'react';
import { TolgeeInstance } from '@tolgee/web';
import { ReactOptions, TolgeeReactContext } from './types';

export const DEFAULT_REACT_OPTIONS: ReactOptions = {
  useSuspense: true,
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

export interface TolgeeProviderProps {
  children?: React.ReactNode;
  tolgee: TolgeeInstance;
  options?: ReactOptions;
  fallback?: React.ReactNode;
}

export const TolgeeProvider: React.FC<TolgeeProviderProps> = ({
  tolgee,
  options,
  children,
  fallback,
}) => {
  const [loading, setLoading] = useState(!tolgee.isLoaded());

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

  const optionsWithDefault = { ...DEFAULT_REACT_OPTIONS, ...options };

  const TolgeeProviderContext = getProviderInstance();

  if (optionsWithDefault.useSuspense) {
    return (
      <TolgeeProviderContext.Provider
        value={{ tolgee, options: optionsWithDefault }}
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
      value={{ tolgee, options: optionsWithDefault }}
    >
      {loading ? fallback : children}
    </TolgeeProviderContext.Provider>
  );
};
