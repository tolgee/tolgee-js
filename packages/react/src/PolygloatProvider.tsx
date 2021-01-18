import * as React from 'react';
import {FunctionComponent, ReactNode, useEffect, useState} from 'react';
import {Polygloat, PolygloatConfig} from "@polygloat/core";

type ContextValueType = PolygloatConfig & { polygloat: Polygloat };
export const PolygloatProviderContext = React.createContext<ContextValueType>(null);
type PolygloatProviderProps = PolygloatConfig & { loadingFallback?: ReactNode };

export const PolygloatProvider: FunctionComponent<PolygloatProviderProps> = (props) => {
    const config = {...props};
    delete config.children;
    delete config.loadingFallback;

    const [polygloat, setPolygloat] = useState(new Polygloat(config));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        polygloat.run().then(() => setLoading(false));

        return () => {
            polygloat.stop();
        }
    }, []);

    return (
        <PolygloatProviderContext.Provider value={{...props, polygloat}}>
            {!loading ? props.children : props.loadingFallback}
        </PolygloatProviderContext.Provider>
    );
}