import React, { Suspense, useEffect, useState } from 'react';
import { TolgeeInstance } from '@tolgee/core';
import { ReactOptions, TolgeeReactContext } from './types';

export const DEFAULT_REACT_OPTIONS: ReactOptions = {
  useSuspense: true,
};

export const TolgeeProviderContext = React.createContext<
  TolgeeReactContext | undefined
>(undefined);

type Props = {
  tolgee: TolgeeInstance;
  options?: ReactOptions;
  fallback?: React.ReactNode;
};

export const TolgeeProvider: React.FC<Props> = ({
  tolgee,
  options,
  children,
  fallback,
}) => {
  const [loading, setLoading] = useState(!tolgee.isLoaded());

  useEffect(() => {
    tolgee.run().then(() => {
      setLoading(false);
    });
    return () => {
      tolgee.stop();
    };
  }, []);

  const optionsWithDefault = { ...DEFAULT_REACT_OPTIONS, ...options };

  if (optionsWithDefault.useSuspense) {
    return (
      <TolgeeProviderContext.Provider
        value={{ tolgee, options: optionsWithDefault }}
      >
        <Suspense fallback={fallback || null}>{children}</Suspense>
      </TolgeeProviderContext.Provider>
    );
  }

  return (
    <TolgeeProviderContext.Provider
      value={{ tolgee, options: optionsWithDefault }}
    >
      {fallback && loading ? fallback : children}
    </TolgeeProviderContext.Provider>
  );
};
