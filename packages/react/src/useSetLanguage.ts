import {usePolygloatContext} from "./usePolygloatContext";

/**
 * Custom react hook
 * @return function accepting language abbreviation as parameter
 */
export const useSetLanguage = () => {
    const context = usePolygloatContext();
    return (language: string) => {
        context.polygloat.lang = language
    };
}