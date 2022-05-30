import { TolgeeState } from '../types';

export const StateService = (initialState: TolgeeState) => {
  let state = { ...initialState };

  const changeState = (newState: Partial<TolgeeState>) => {
    state = {
      ...state,
      ...newState,
    };
  };

  const setLanguage = (language: string) => {
    changeState({ language });
  };

  const getLanguage = () => {
    return state.language;
  };

  const isRunning = () => {
    return state.running;
  };

  const run = () => {
    changeState({ running: true });
  };
  const stop = () => {
    changeState({ running: false });
  };

  return Object.freeze({
    setLanguage,
    getLanguage,
    isRunning,
    run,
    stop,
  });
};

export type StateServiceInstance = ReturnType<typeof StateService>;
