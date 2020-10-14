import {useEffect} from "react";

export const useWithStyles = (css: string) => {
    useEffect(() => {
        const head = document.getElementsByTagName('head')[0];
        const styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        styleElement.appendChild(document.createTextNode(css));
        head.appendChild(styleElement);
        return () => {
            const head = document.getElementsByTagName('head')[0];
            head.removeChild(styleElement);
        }
    }, []);
}