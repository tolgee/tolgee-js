import * as React from 'react';
import { FC } from 'react';

export interface StylesContextType {
  insertionPoint: Element;
}

export const StylesContext = React.createContext<StylesContextType>(undefined);

export const StylesContextProvider: FC<{ insertionPoint?: Element }> = (
  props
) => {
  const contextValue = {
    insertionPoint:
      props.insertionPoint || document.getElementsByTagName('head')[0],
  };

  return (
    <StylesContext.Provider value={contextValue}>
      {props.children}
    </StylesContext.Provider>
  );
};
