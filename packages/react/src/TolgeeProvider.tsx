import React, { Suspense, useEffect, useState } from 'react';
import { TolgeeInstance } from '@tolgee/web';
import { ReactOptions, TolgeeReactContext } from './types';

export const DEFAULT_REACT_OPTIONS: ReactOptions = {
  useSuspense: true,
};

export const TolgeeProviderContext = React.createContext<
  TolgeeReactContext | undefined
>(undefined);

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

  useEffect(() => {
    tolgee
      .run()
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tolgee]);

  const optionsWithDefault = { ...DEFAULT_REACT_OPTIONS, ...options };

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
