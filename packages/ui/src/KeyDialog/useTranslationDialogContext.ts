import { useContext } from 'react';
import { TranslationDialogContext } from './TranslationDialogContextProvider';

export const useTranslationDialogContext = () =>
  useContext(TranslationDialogContext);
