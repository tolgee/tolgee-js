import React from 'react';
import { TranslationDialogWrapper } from './TranslationDialogWrapper';
import { useTranslationDialogContext } from './useTranslationDialogContext';
import { ScreenshotPreview } from './ScreenshotPreview';
import { KeyForm } from './KeyForm';

export const TranslationDialog = () => {
  const context = useTranslationDialogContext();

  return (
    <TranslationDialogWrapper context={context}>
      {context.lastScreenshot ? <ScreenshotPreview /> : <KeyForm />}
    </TranslationDialogWrapper>
  );
};
