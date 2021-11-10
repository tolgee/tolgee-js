import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTolgeeContext } from './useTolgeeContext';
import { TranslationParameters } from './types';
import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '@tolgee/core';

type TProps = {
  parameters?: TranslationParameters;
  children?: string;
  /**
   * @deprecated Use strategy 'NO_WRAP' instead
   */
  noWrap?: boolean;
  strategy?: 'ELEMENT_WRAP' | 'TEXT_WRAP' | 'NO_WRAP';
  keyName?: string;
};

export const T: FunctionComponent<TProps> = (props: TProps) => {
  const strategy =
    props.noWrap === true ? 'NO_WRAP' : props.strategy || 'ELEMENT_WRAP';

  const context = useTolgeeContext();

  const key = props.keyName || props.children;
  if (!key) {
    // eslint-disable-next-line no-console
    console.error('T component: keyName not defined');
  }
  const defaultValue = props.keyName ? props.children : undefined;

  const translateFnNoWrap =
    typeof window !== 'undefined'
      ? strategy === 'ELEMENT_WRAP' || strategy === 'NO_WRAP'
      : true;

  const [translated, setTranslated] = useState(
    context.tolgee.instant(
      key,
      props.parameters,
      translateFnNoWrap,
      true,
      defaultValue
    )
  );

  const translate = () =>
    context.tolgee
      .translate({
        key,
        params: props.parameters,
        noWrap: translateFnNoWrap,
        defaultValue,
      })
      .then((t) => {
        setTranslated(t);
      });

  useEffect(() => {
    translate();

    const langChangeSubscription = context.tolgee.onLangChange.subscribe(() => {
      translate();
    });

    return () => {
      langChangeSubscription.unsubscribe();
    };
  }, [props]);

  useEffect(() => {
    if (strategy === 'ELEMENT_WRAP' || strategy === 'NO_WRAP') {
      const translationChangeSubscription =
        context.tolgee.onTranslationChange.subscribe((data) => {
          if (data.key === key) {
            translate();
          }
        });

      return () => {
        translationChangeSubscription.unsubscribe();
      };
    }
  });

  if (strategy === 'ELEMENT_WRAP') {
    return (
      <span {...{ [TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE]: key }}>
        {translated}
      </span>
    );
  }

  return <>{translated}</>;
};
