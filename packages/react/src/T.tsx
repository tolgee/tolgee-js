import * as React from 'react';
import {FunctionComponent, useEffect, useState} from 'react';
import {usePolygloatContext} from "./usePolygloatContext";
import {TranslationParameters} from "./types";

type TProps = { parameters?: TranslationParameters, children: string, noWrap?: boolean }

export const T: FunctionComponent<TProps> = (props: TProps) => {
    const context = usePolygloatContext();

    const [translated, setTranslated] = useState(context.polygloat.instant(props.children, props.parameters, props.noWrap, true));
    const translate = () => context.polygloat.translate(props.children, props.parameters, props.noWrap).then(t => {
        setTranslated(t);
    });

    useEffect(() => {
        translate();

        const subscription = context.polygloat.onLangChange.subscribe(() => {
            translate();
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [props])

    return <>{translated}</>;
}