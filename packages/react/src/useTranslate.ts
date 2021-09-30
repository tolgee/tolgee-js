import { useTolgeeContext } from './useTolgeeContext';
import { TranslationParameters } from './types';
import { useEffect, useState } from 'react';

type UseTranslateResultFnProps = {
  key: string;
  parameters?: TranslationParameters;
  noWrap?: boolean;
  defaultValue?: string;
};

type ReturnFnType = {
  (props: UseTranslateResultFnProps): string;
  (
    key: string,
    parameters?: TranslationParameters,
    noWrap?: boolean,
    defaultValue?: string
  ): string;
};

export const useTranslate: () => ReturnFnType = () => {
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
    defaultValue: string | undefined;
  } => {
    return JSON.parse(jsonKey);
  };
  const getJsonHash = (
    parameters: TranslationParameters,
    noWrap: boolean,
    defaultValue: string | undefined
  ) => {
    return JSON.stringify({ parameters, noWrap, defaultValue });
  };

  const translationFromState = (
    key: string,
    parameters: TranslationParameters,
    noWrap: boolean,
    defaultValue: string | undefined
  ) => {
    const jsonHash = getJsonHash(parameters, noWrap, defaultValue);

    if (translated[key] === undefined) {
      translated[key] = {};
    }

    if (translated[key][jsonHash] === undefined) {
      translated[key][jsonHash] = context.tolgee.instant({
        key,
        params: parameters,
        noWrap,
        orEmpty: true,
        defaultValue,
      });
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
          const { parameters, noWrap, defaultValue } = parseJsonHash(jsonHash);
          return new Promise((resolve) => {
            context.tolgee
              .translate(key, parameters, noWrap, defaultValue)
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
                params.noWrap,
                params.defaultValue
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
    keyOrProps: string | UseTranslateResultFnProps,
    parameters?: TranslationParameters,
    noWrap?: boolean,
    defaultValue?: string
  ) => {
    // allow user to pass object of params and make the code cleaner
    const key = typeof keyOrProps === 'string' ? keyOrProps : keyOrProps.key;
    if (typeof keyOrProps === 'object') {
      parameters = keyOrProps.parameters;
      noWrap = keyOrProps.noWrap;
      defaultValue = keyOrProps.defaultValue;
    }

    return translationFromState(key, parameters, noWrap, defaultValue);
  };
};
