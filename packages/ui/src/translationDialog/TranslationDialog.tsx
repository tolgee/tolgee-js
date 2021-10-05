import React from 'react';
import { TranslationDialogWrapper } from './TranslationDialogWrapper';
import { useTranslationDialogContext } from './useTranslationDialogContext';
import { KeyForm } from './KeyForm';

export const TranslationDialog = () => {
  const context = useTranslationDialogContext();

  return (
    <TranslationDialogWrapper context={context}>
      <KeyForm />
    </TranslationDialogWrapper>
  );
};
