import {
  getTranslateProps,
  TolgeeInstance,
  TolgeeStaticData,
} from '@tolgee/web';
import { useEffect, useMemo, useState } from 'react';

function getTolgeeWithDeactivatedWrapper(
  tolgee: TolgeeInstance
): TolgeeInstance {
  return {
    ...tolgee,
    t(...args) {
      // @ts-ignore
      const props = getTranslateProps(...args);
      return tolgee.t({ ...props, noWrap: true });
    },
  };
}

export function useTolgeeSSR(
  tolgeeInstance: TolgeeInstance,
  locale?: string,
  staticData?: TolgeeStaticData | undefined
) {
  const initialInstance = useMemo(
    () => getTolgeeWithDeactivatedWrapper(tolgeeInstance),
    []
  );

  const [tolgee, setTolgee] = useState(initialInstance);

  useEffect(() => {
    setTolgee(tolgeeInstance);
  }, []);

  useMemo(() => {
    // we have to prepare tolgee before rendering children
    // so translations are available right away
    // events emitting must be off, to not trigger re-render while rendering
    tolgee.setEmitterActive(false);
    tolgee.addStaticData(staticData);
    tolgee.changeLanguage(locale!);
    tolgee.setEmitterActive(true);
  }, [locale, staticData, tolgee]);

  return tolgee;
}
