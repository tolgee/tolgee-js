import React from 'react';
import { TranslationDialogWrapper } from './TranslationDialogWrapper';
import { useTranslationDialogContext } from './useTranslationDialogContext';
import { KeyForm } from './KeyForm';
import { ThemeProvider } from '../ThemeProvider';

export const TranslationDialog = () => {
  const context = useTranslationDialogContext();

  return (
    <ThemeProvider>
      <TranslationDialogWrapper context={context}>
        <KeyForm />
      </TranslationDialogWrapper>
    </ThemeProvider>
  );
};
