import type { ObserverOptions } from './types';
import type { Options, TolgeePlugin } from '@tolgee/core';
import { InvisibleObserver } from './InvisibleObserver';
import { DevBackend } from './DevBackend';
import { ContextUi } from './ContextUi';

type Props = {
  tolgee?: Partial<Options>;
  observer?: Partial<ObserverOptions>;
};

export const InContextTools: (props?: Props) => TolgeePlugin =
  (props) => (tolgee) => {
    tolgee.use(InvisibleObserver(props?.observer));
    tolgee.use(DevBackend());
    tolgee.use(ContextUi());
    if (props?.tolgee) {
      tolgee.init(props.tolgee);
    }
    return tolgee;
  };
