import { useTolgeeContext } from './useTolgeeContext';
import { TranslationParameters } from './types';
import { useEffect, useRef, useState } from 'react';

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

  // dummy state to enable re-rendering
  const [_, setDummyValue] = useState(0 as number);

  const forceRerender = () => {
    setDummyValue((v) => v + 1);
  };

  // cache of translations translated with this useTranslate
  const translatedRef = useRef<Record<string, Record<string, string>>>({});
  const translated = translatedRef.current;

  // Parses key of the translation cache
  const parseJsonHash = (
    jsonKey
  ): {
    parameters: TranslationParameters | undefined;
    noWrap: boolean | undefined;
    defaultValue: string | undefined;
  } => {
    return JSON.parse(jsonKey);
  };

  // Generates key to store in translations cache
  const getJsonHash = (
    parameters: TranslationParameters,
    noWrap: boolean,
    defaultValue: string | undefined
  ) => {
    return JSON.stringify({ parameters, noWrap, defaultValue });
  };

  // Returns the translation from cache.
  //
  // If not found, instant value is returned
  // and async translateAll method is executed
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
      translateAll();
    }

    return translated[key][jsonHash];
  };

  // Refreshes all translations in cache
  // and forces rerender
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
      result.forEach((item) => {
        translated[item.key][item.jsonHash] = item.translated;
      });
      forceRerender();
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
              translated[key][jsonHash] = await context.tolgee.translate(
                key,
                params.parameters,
                params.noWrap,
                params.defaultValue
              );
              forceRerender();
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
