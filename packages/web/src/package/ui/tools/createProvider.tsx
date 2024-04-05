import {
  useMemo,
  useRef,
  createContext as createRegularContext,
  useContext,
} from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

type SelectorType<StateType, ReturnType> = (state: StateType) => ReturnType;

export const createProvider = <StateType, Actions, ProviderProps>(
  controller: (props: ProviderProps) => [state: StateType, actions: Actions]
) => {
  const StateContext = createContext<StateType>(null as any);
  const DispatchContext = createRegularContext<Actions>(null as any);

  const Provider = ({
    children,
    ...props
  }: React.PropsWithChildren<ProviderProps>) => {
    const [state, _actions] = controller(props as any);
    const actionsRef = useRef(_actions);

    actionsRef.current = _actions;

    // stable actions
    const actions = useMemo(() => {
      const result = {};
      Object.keys(actionsRef.current as any).map((key) => {
        // @ts-ignore
        result[key] = (...args) => actionsRef.current[key]?.(...args);
      });
      return result as Actions;
    }, [actionsRef]);

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={actions}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  };

  const useActions = () => useContext(DispatchContext);
  const useStateContext = function <SelectorReturn>(
    selector: SelectorType<StateType, SelectorReturn>
  ) {
    return useContextSelector(StateContext, selector);
  };

  return [Provider, useActions, useStateContext] as const;
};
