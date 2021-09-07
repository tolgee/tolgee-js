import * as React from 'react';
import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { Tolgee, TolgeeConfig } from '@tolgee/core';

type ContextValueType = TolgeeConfig & { tolgee: Tolgee };
export const TolgeeProviderContext =
  React.createContext<ContextValueType>(null);
type TolgeeProviderProps = TolgeeConfig & { loadingFallback?: ReactNode };

export const TolgeeProvider: FunctionComponent<TolgeeProviderProps> = (
  props
) => {
  const config = { ...props };
  delete config.children;
  delete config.loadingFallback;

  const [tolgee] = useState(new Tolgee(config));

  const [loading, setLoading] = useState(tolgee.initialLoading);

  useEffect(() => {
    tolgee.run().then(() => setLoading(false));

    return () => {
      tolgee.stop();
    };
  }, []);

  return (
    <TolgeeProviderContext.Provider value={{ ...props, tolgee }}>
      {!loading ? props.children : props.loadingFallback}
    </TolgeeProviderContext.Provider>
  );
};
