/* eslint-disable @typescript-eslint/no-var-requires */
import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  IcuFormat,
  InvisibleObserver,
  Options,
  Tolgee,
  TolgeeInstance,
} from '@tolgee/core';
import { UI } from '@tolgee/ui';

type ContextValueType = { tolgee: TolgeeInstance };
export const TolgeeProviderContext =
  React.createContext<ContextValueType>(null);
type TolgeeProviderProps = Partial<Options> & { loadingFallback?: ReactNode };

export const TolgeeProvider: FunctionComponent<
  PropsWithChildren<TolgeeProviderProps>
> = (props) => {
  const config = { ...props };
  delete config.children;
  delete config.loadingFallback;

  const [tolgee] = useState(
    Tolgee()
      .setUi(UI as any)
      .setObserver(InvisibleObserver())
      .setFormat(IcuFormat)
      .init({
        ...config,
      })
  );

  const [loading, setLoading] = useState(tolgee.isLoading);

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
      {!loading ? props.children : props.loadingFallback}
    </TolgeeProviderContext.Provider>
  );
};
