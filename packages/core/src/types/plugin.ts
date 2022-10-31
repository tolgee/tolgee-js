import { TolgeeInstance } from './TolgeeInstance';
import {
  BackendInterface,
  DevCredentials,
  FinalFormatterInterface,
  FormatterInterface,
  LanguageDetectorInterface,
  LanguageStorageInterface,
  ObserverInterface,
  UiLibInterface,
} from '../types';

export type PluginTools = Readonly<{
  setFinalFormatter: (formatter: FinalFormatterInterface | undefined) => void;
  addFormatter: (formatter: FormatterInterface | undefined) => void;
  setObserver: (observer: ObserverInterface | undefined) => void;
  hasObserver: () => boolean;
  setUi: (ui: UiLibInterface | undefined) => void;
  hasUi: () => boolean;
  addBackend: (backend: BackendInterface | undefined) => void;
  setDevBackend: (backend: BackendInterface | undefined) => void;
  setLanguageDetector: (
    languageDetector: LanguageDetectorInterface | undefined
  ) => void;
  setLanguageStorage: (
    languageStorage: LanguageStorageInterface | undefined
  ) => void;
  overrideCredentials: (credentials: DevCredentials) => void;
}>;
export type TolgeePlugin = (
  tolgee: TolgeeInstance,
  tools: PluginTools
) => TolgeeInstance;
