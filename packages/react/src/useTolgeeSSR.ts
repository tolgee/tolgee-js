import {
  getTranslateProps,
  TolgeeInstance,
  TolgeeStaticData,
  isSSR,
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

/**
 * Updates tolgee static data and language, to be ready right away for the first render
 * and therefore compatible with SSR.
 *
 * It also ensures that the first render is done without wrapping and so it avoids
 * "client different than server" issues.
 *
 * If no language data and static data are provided no action is taken
 *
 * @param tolgeeInstance initialized Tolgee instance
 * @param language language that is obtained outside of Tolgee on the server and client
 * @param staticData static data for the language
 */
export function useTolgeeSSR(
  tolgeeInstance: TolgeeInstance,
  language?: string,
  staticData?: TolgeeStaticData | undefined
) {
  const enabled = Boolean(language || staticData);

  const [noWrappingTolgee] = useState(() =>
    getTolgeeWithDeactivatedWrapper(tolgeeInstance)
  );

  const [initialRender, setInitialRender] = useState(enabled);

  useEffect(() => {
    setInitialRender(false);
  }, []);

  useMemo(() => {
    // we have to prepare tolgee before rendering children
    // so translations are available right away
    // events emitting must be off, to not trigger re-render while rendering
    if (enabled) {
      tolgeeInstance.setEmitterActive(false);
      tolgeeInstance.addStaticData(staticData);
      tolgeeInstance.changeLanguage(language!);
      tolgeeInstance.setEmitterActive(true);
    }
  }, [language, staticData, tolgeeInstance]);

  useState(() => {
    if (enabled && isSSR()) {
      // running this function only on first render
      if (!tolgeeInstance.isLoaded()) {
        // warning user, that static data provided are not sufficient
        // for proper SSR render
        const missingRecords = tolgeeInstance
          .getRequiredRecords(language)
          .map(({ namespace, language }) =>
            namespace ? `${namespace}:${language}` : language
          )
          .filter((key) => !staticData?.[key]);

        // eslint-disable-next-line no-console
        console.warn(
          `Tolgee: Missing records in "staticData" for proper SSR functionality: ${missingRecords.map((key) => `"${key}"`).join(', ')}`
        );
      }
    }
  });

  return initialRender ? noWrappingTolgee : tolgeeInstance;
}
