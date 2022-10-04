import type { Options, TolgeePlugin } from '@tolgee/core';
import { InvisibleObserver } from './InvisibleObserver';
import { DevBackend } from './DevBackend';
import { ContextUi } from './ContextUi';

type Props = {
  tolgee?: Partial<Options>;
};

export const InContextTools: (props?: Props) => TolgeePlugin =
  (props) => (tolgee) => {
    tolgee.use(InvisibleObserver());
    tolgee.use(DevBackend());
    tolgee.use(ContextUi());
    if (props?.tolgee) {
      tolgee.init(props.tolgee);
    }
    return tolgee;
  };
