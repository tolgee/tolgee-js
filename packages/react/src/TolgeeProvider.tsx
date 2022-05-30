/* eslint-disable @typescript-eslint/no-var-requires */
import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { IcuFormatter, Tolgee, TolgeeConfig } from '@tolgee/core';

type ContextValueType = TolgeeConfig & { tolgee: Tolgee };
export const TolgeeProviderContext =
  React.createContext<ContextValueType>(null);
type TolgeeProviderProps = TolgeeConfig & { loadingFallback?: ReactNode };

export const TolgeeProvider: FunctionComponent<
  PropsWithChildren<TolgeeProviderProps>
> = (props) => {
  const config = { ...props };
  delete config.children;
  delete config.loadingFallback;

  const [tolgee] = useState(
    Tolgee.use(IcuFormatter).init({
      wrapperMode: 'invisible',
      ui:
        process.env.NODE_ENV !== 'development'
          ? undefined
          : typeof require !== 'undefined'
          ? require('@tolgee/ui')
          : import('@tolgee/ui'),
      ...config,
    })
  );

  const [loading, setLoading] = useState(tolgee.initialLoading);

  //rerender components on forceLanguage change
  useEffect(() => {
    if (config.forceLanguage !== undefined) {
      tolgee.properties.config.forceLanguage = config.forceLanguage;
      tolgee.lang = config.forceLanguage;
    }
  }, [config.forceLanguage]);

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
