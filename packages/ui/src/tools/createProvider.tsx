import React, { useCallback, useRef } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

type DispatchType<ActionType, DispatchReturn> = (
  action: ActionType
) => DispatchReturn;

type SelectorType<StateType> = (state: StateType) => any;

export const createProvider = <
  StateType,
  ActionType,
  DispatchReturn,
  ProviderProps
>(
  body: (
    props: ProviderProps
  ) => [state: StateType, dispatch: DispatchType<ActionType, DispatchReturn>]
) => {
  const StateContext = createContext<StateType>(null as any);
  const DispatchContext = React.createContext<
    DispatchType<ActionType, DispatchReturn>
  >(null as any);

  const Provider: React.FC<ProviderProps> = ({ children, ...props }) => {
    const [state, _dispatch] = body(props as any);
    const dispatchRef = useRef(_dispatch);

    dispatchRef.current = _dispatch;

    // stable dispatch function
    const dispatch = useCallback(
      (action: ActionType) => dispatchRef.current?.(action),
      [dispatchRef]
    );

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  };

  const useDispatch = () => React.useContext(DispatchContext);
  const useStateContext = (selector: SelectorType<StateType>) =>
    useContextSelector(StateContext, selector);

  return [Provider, useDispatch, useStateContext] as const;
};
