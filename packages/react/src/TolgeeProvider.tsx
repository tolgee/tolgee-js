import React, { useEffect, useState } from 'react';
import { TolgeeInstance } from '@tolgee/core';

type ContextValueType = { tolgee: TolgeeInstance };
export const TolgeeProviderContext =
  React.createContext<ContextValueType>(null);

type Props = {
  tolgee: TolgeeInstance;
  fallback?: React.ReactNode;
};

export const TolgeeProvider: React.FC<Props> = ({
  tolgee,
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

  return (
    <TolgeeProviderContext.Provider value={{ tolgee }}>
      {fallback && loading ? fallback : children}
    </TolgeeProviderContext.Provider>
  );
};
