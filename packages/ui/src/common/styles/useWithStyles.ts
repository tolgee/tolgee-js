import { useContext, useEffect } from 'react';
import { StylesContext } from './StylesContextProvider';

export const useWithStyles = (css: string) => {
  const context = useContext(StylesContext);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.appendChild(document.createTextNode(css));
    context.insertionPoint.appendChild(styleElement);
    return () => {
      context.insertionPoint.removeChild(styleElement);
    };
  }, [css, context.insertionPoint]);
};
