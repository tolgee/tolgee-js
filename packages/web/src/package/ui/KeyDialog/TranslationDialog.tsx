import { TranslationDialogWrapper } from './TranslationDialogWrapper';
import { KeyForm } from './KeyForm';
import { ThemeProvider } from '../ThemeProvider';

export const TranslationDialog = () => {
  return (
    <ThemeProvider>
      <TranslationDialogWrapper>
        <KeyForm />
      </TranslationDialogWrapper>
    </ThemeProvider>
  );
};
