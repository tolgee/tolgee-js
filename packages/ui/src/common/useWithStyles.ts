import { useEffect } from 'react';

export const useWithStyles = (css: string) => {
  const styleElement = document.createElement('style');
  const head = document.getElementsByTagName('head')[0];
  styleElement.setAttribute('type', 'text/css');
  styleElement.appendChild(document.createTextNode(css));
  head.appendChild(styleElement);

  useEffect(() => {
    return () => {
      const head = document.getElementsByTagName('head')[0];
      head.removeChild(styleElement);
    };
  });
};
