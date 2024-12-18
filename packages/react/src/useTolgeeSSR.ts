import {
  CachePublicRecord,
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

/**
 * Updates tolgee static data and language, to be ready right away for the first render
 * and therefore compatible with SSR.
 *
 * It also ensures that the first render is done without wrapping and so it avoids
 * "client different than server" issues.
 * *
 * @param tolgeeInstance initialized Tolgee instance
 * @param language language that is obtained outside of Tolgee on the server and client
 * @param staticData static data for the language
 * @param enabled if set to false, no action is taken
 */
export function useTolgeeSSR(
  tolgeeInstance: TolgeeInstance,
  language?: string,
  data?: TolgeeStaticData | CachePublicRecord[] | undefined,
  enabled = true
) {
  const [noWrappingTolgee] = useState(() =>
    getTolgeeWithDeactivatedWrapper(tolgeeInstance)
  );

  const [initialRender, setInitialRender] = useState(enabled);

  useEffect(() => {
    setInitialRender(false);
  }, []);

  useMemo(() => {
    if (enabled) {
      // we have to prepare tolgee before rendering children
      // so translations are available right away
      // events emitting must be off, to not trigger re-render while rendering
      tolgeeInstance.setEmitterActive(false);
      tolgeeInstance.addStaticData(data);
      tolgeeInstance.changeLanguage(language!);
      tolgeeInstance.setEmitterActive(true);
    }
  }, [language, data, tolgeeInstance]);

  useState(() => {
    // running this function only on first render
    if (!tolgeeInstance.isLoaded() && enabled) {
      // warning user, that static data provided are not sufficient
      // for proper SSR render
      const requiredRecords = tolgeeInstance.getRequiredDescriptors(language);
      const providedRecords = tolgeeInstance.getAllRecords();
      const missingRecords = requiredRecords
        .map(({ namespace, language }) =>
          namespace ? `${namespace}:${language}` : language
        )
        .filter((key) => !providedRecords.find((r) => r?.cacheKey === key));

      // eslint-disable-next-line no-console
      console.warn(
        `Tolgee: Missing records in "staticData" for proper SSR functionality: ${missingRecords.map((key) => `"${key}"`).join(', ')}`
      );
    }
  });

  return initialRender ? noWrappingTolgee : tolgeeInstance;
}
