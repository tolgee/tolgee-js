import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTolgeeContext } from './useTolgeeContext';
import { TranslationParameters } from './types';

type TProps = {
  parameters?: TranslationParameters;
  children: string;
  noWrap?: boolean;
};

export const T: FunctionComponent<TProps> = (props: TProps) => {
  const context = useTolgeeContext();

  const [translated, setTranslated] = useState(
    context.tolgee.instant(props.children, props.parameters, props.noWrap, true)
  );
  const translate = () =>
    context.tolgee
      .translate(props.children, props.parameters, props.noWrap)
      .then((t) => {
        setTranslated(t);
      });

  useEffect(() => {
    translate();

    const subscription = context.tolgee.onLangChange.subscribe(() => {
      translate();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [props]);

  return <>{translated}</>;
};
