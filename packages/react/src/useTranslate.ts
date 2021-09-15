import { useTolgeeContext } from './useTolgeeContext';
import { TranslationParameters } from './types';
import { useEffect, useState } from 'react';

export const useTranslate = () => {
  const context = useTolgeeContext();
  const [translated, setTranslated] = useState(
    {} as Record<string, Record<string, string>>
  );
  const [wasInstant, setWasInstant] = useState(false);

  const parseJsonHash = (
    jsonKey
  ): {
    parameters: TranslationParameters | undefined;
    noWrap: boolean | undefined;
  } => {
    return JSON.parse(jsonKey);
  };

  const getJsonHash = (parameters: TranslationParameters, noWrap: boolean) => {
    return JSON.stringify({ parameters, noWrap });
  };

  const translationFromState = (
    key: string,
    parameters: TranslationParameters,
    noWrap: boolean
  ) => {
    const jsonHash = getJsonHash(parameters, noWrap);

    if (translated[key] === undefined) {
      translated[key] = {};
    }

    if (translated[key][jsonHash] === undefined) {
      translated[key][jsonHash] = context.tolgee.instant(
        key,
        parameters,
        noWrap,
        true
      );
      setTranslated({ ...translated });
      setWasInstant(true);
    }

    return translated[key][jsonHash];
  };

  useEffect(() => {
    if (wasInstant) {
      translateAll();
    }
    setWasInstant(false);
  }, [wasInstant]);

  const translateAll = () => {
    const translationPromises = Object.entries(translated).flatMap(
      ([key, data]) => {
        return Object.keys(data).map((jsonHash) => {
          const { parameters, noWrap } = parseJsonHash(jsonHash);
          return new Promise((resolve) => {
            context.tolgee
              .translate(key, parameters, noWrap)
              .then((translated) =>
                resolve({ key: key, jsonHash, translated })
              );
          }) as Promise<{ key: string; jsonHash: string; translated: string }>;
        });
      }
    );

    Promise.all(translationPromises).then((result) => {
      const newTranslated = result.reduce(
        (newTranslated: Record<string, Record<string, string>>, current) => {
          return {
            ...newTranslated,
            [current.key]: {
              ...newTranslated[current.key],
              [current.jsonHash]: current.translated,
            },
          };
        },
        {}
      ) as Record<string, Record<string, string>>;
      setTranslated((translated) => ({ ...translated, ...newTranslated }));
    });
  };

  useEffect(() => {
    translateAll();

    const subscription = context.tolgee.onLangChange.subscribe(() =>
      translateAll()
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = context.tolgee.onTranslationChange.subscribe(
      (changeData) => {
        Object.entries(translated).map(([key, data]) => {
          if (key === changeData.key) {
            return Object.keys(data).map(async (jsonHash) => {
              const params = parseJsonHash(jsonHash);
              const newTranslated = await context.tolgee.translate(
                key,
                params.parameters,
                params.noWrap
              );
              setTranslated((oldTranslated) => ({
                ...oldTranslated,
                [key]: { ...oldTranslated[key], [jsonHash]: newTranslated },
              }));
            });
          }
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    source: string,
    parameters?: TranslationParameters,
    noWrap?: boolean
  ) => translationFromState(source, parameters, noWrap);
};
