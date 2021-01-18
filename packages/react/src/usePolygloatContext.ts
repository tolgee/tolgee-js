import {useContext} from "react";
import {PolygloatProviderContext} from "./PolygloatProvider";

export const usePolygloatContext = () => {
    let context = useContext(PolygloatProviderContext);

    if (context === null) {
        throw new Error("Polygloat context is null. Is this code executed inside PolygloatProvider component?")
    }

    return context;
};