import { useTolgeeContext } from './useTolgeeContext';
import { TranslationParameters, TranslationsStateKey } from './types';
import { useEffect, useState } from 'react';

export const useTranslate = () => {
  const context = useTolgeeContext();
  const [translated, setTranslated] = useState({});
  const [wasInstant, setWasInstant] = useState(false);

  const parseJsonKey = (jsonKey): TranslationsStateKey => {
    return JSON.parse(jsonKey);
  };

  const getJsonKey = (
    source: string,
    parameters: TranslationParameters,
    noWrap: boolean
  ) => {
    return JSON.stringify({ source: source, parameters, noWrap });
  };

  const translationFromState = (
    source: string,
    parameters: TranslationParameters,
    noWrap: boolean
  ) => {
    const jsonKey = getJsonKey(source, parameters, noWrap);

    if (translated[jsonKey] === undefined) {
      translated[jsonKey] = context.tolgee.instant(
        source,
        parameters,
        noWrap,
        true
      );
      setTranslated({ ...translated });
      setWasInstant(true);
    }

    return translated[jsonKey];
  };

  useEffect(() => {
    if (wasInstant) {
      translateAll();
    }
    setWasInstant(false);
  }, [wasInstant]);

  const translateAll = () => {
    const transactionPremises = Object.entries(translated).map(
      ([jsonKey, _]) => {
        const params = parseJsonKey(jsonKey);
        return new Promise((resolve) => {
          context.tolgee
            .translate(params.source, params.parameters, params.noWrap)
            .then((translated) => resolve({ jsonKey, translated }));
        });
      }
    );

    Promise.all(transactionPremises).then((result) => {
      const newTranslated = result.reduce(
        (newTranslated: Record<string, unknown>, current: any) => {
          return { ...newTranslated, [current.jsonKey]: current.translated };
        },
        {}
      ) as Record<string, unknown>;
      setTranslated({ ...translated, ...newTranslated });
    });
  };

  useEffect(() => {
    translateAll();

    const subscription = context.tolgee.onLangChange.subscribe(() =>
      translateAll()
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    source: string,
    parameters?: TranslationParameters,
    noWrap?: boolean
  ) => translationFromState(source, parameters, noWrap);
};
