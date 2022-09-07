/* eslint-disable @typescript-eslint/no-var-requires */
import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react';
import { Options, Tolgee } from '@tolgee/core';
import { UI, InvisibleObserver } from '@tolgee/devtools-web';
import { TolgeeProvider } from './TolgeeProvider';

type TolgeeProviderProps = Partial<Options> & { loadingFallback?: ReactNode };

export const TolgeeProviderDefault: FunctionComponent<
  PropsWithChildren<TolgeeProviderProps>
> = (props) => {
  const config = { ...props };
  delete config.children;
  delete config.loadingFallback;

  const [tolgee] = useState(
    Tolgee()
      .setUi(UI as any)
      .setObserver(InvisibleObserver())
      .init({
        ...config,
      })
  );

  return (
    <TolgeeProvider tolgee={tolgee} fallback={props.loadingFallback}>
      {props.children}
    </TolgeeProvider>
  );
};
