import {usePolygloatContext} from "./usePolygloatContext";
import {useEffect, useState} from "react";

/**
 * Custom react hook
 * @return function accepting language abbreviation as parameter
 */
export const useCurrentLanguage = () => {
    const context = usePolygloatContext();

    //to make react rerender components which are using current language
    const [language, setLanguage] = useState(context.polygloat.lang);

    useEffect(() => {
        const subscription = context.polygloat.onLangChange.subscribe((lang) => {
            setLanguage(lang);
        });
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    return () => {
        return language;
    };
}