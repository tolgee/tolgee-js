import { EventEmitterType, FallbackNSTranslation } from '../../types';
import { getFallback, getFallbackFromStruct, unique } from './helpers';
import { initState, Options } from './initState';

type Props = {
  onLanguageChange: EventEmitterType<string>;
  onPendingLanguageChange: EventEmitterType<string>;
  onRunningChange: EventEmitterType<boolean>;
};

export const State = ({
  onLanguageChange,
  onPendingLanguageChange,
  onRunningChange,
}: Props) => {
  let state = initState();

  function init(options?: Partial<Options>) {
    state = initState(options, state);
  }

  function isRunning() {
    return state.isRunning;
  }

  function setRunning(value: boolean) {
    if (state.isRunning !== value) {
      state.isRunning = value;
      onRunningChange.emit(value);
    }
  }

  function isInitialLoading() {
    return state.isInitialLoading;
  }

  function setInitialLoading(value: boolean) {
    state.isInitialLoading = value;
  }

  function getLanguage() {
    const language = state.language || state.initialOptions.language;
    if (!language) {
      throw new Error(`No language set`);
    }
    return language;
  }

  function setLanguage(language: string) {
    if (state.language !== language) {
      state.language = language;
      onLanguageChange.emit(language);
    }
  }

  function getPendingLanguage() {
    return state.pendingLanguage || getLanguage();
  }

  function setPendingLanguage(language: string) {
    if (state.pendingLanguage !== language) {
      state.pendingLanguage = language;
      onPendingLanguageChange.emit(language);
    }
  }

  function getInitialOptions() {
    return state.initialOptions;
  }

  function addActiveNs(ns: FallbackNSTranslation) {
    const namespaces = getFallback(ns);
    namespaces.forEach((namespace) => {
      const value = state.activeNamespaces.get(namespace);
      if (value !== undefined) {
        state.activeNamespaces.set(namespace, value + 1);
      } else {
        state.activeNamespaces.set(namespace, 1);
      }
    });
  }

  function removeActiveNs(ns: FallbackNSTranslation) {
    const namespaces = getFallback(ns);
    namespaces.forEach((namespace) => {
      const value = state.activeNamespaces.get(namespace);
      if (value !== undefined && value > 1) {
        state.activeNamespaces.set(namespace, value - 1);
      } else {
        state.activeNamespaces.delete(namespace);
      }
    });
  }

  function getRequiredNamespaces() {
    return unique([
      ...(state.initialOptions.ns || [state.initialOptions.defaultNs]),
      ...state.activeNamespaces.keys(),
    ]);
  }

  function getFallbackLangs(lang?: string) {
    const language = lang || getLanguage();
    return unique([
      language,
      ...getFallbackFromStruct(language, state.initialOptions.fallbackLanguage),
    ]);
  }

  function getFallbackNamespaces() {
    const defaultNs = state.initialOptions.defaultNs;
    const fallbackNs = state.initialOptions.fallbackNs;
    const fallbackNamespaces = typeof defaultNs === 'string' ? [defaultNs] : [];
    return unique([...fallbackNamespaces, ...getFallback(fallbackNs)]);
  }

  return Object.freeze({
    init,
    isRunning,
    setRunning,
    isInitialLoading,
    setInitialLoading,
    getLanguage,
    setLanguage,
    getPendingLanguage,
    setPendingLanguage,
    getInitialOptions,
    addActiveNs,
    removeActiveNs,
    getRequiredNamespaces,
    getFallbackLangs,
    getFallbackNamespaces,
  });
};
