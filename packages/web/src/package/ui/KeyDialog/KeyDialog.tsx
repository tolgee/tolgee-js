import type { UiProps } from '@tolgee/core';

import { useEffect, useState } from 'react';
import { QueryProvider } from '../client/QueryProvider';
import { DialogProvider } from './dialogContext';
import { TranslationDialog } from './TranslationDialog';

export type ComponentDependencies = UiProps;

export type KeyData = {
  key: null | string;
  defaultValue: undefined | string;
  fallbackNamespaces: string[];
  namespace: string;
};

export type Props = {
  uiProps: UiProps;
  keyData: KeyData;
};

export const KeyDialog = ({ uiProps, keyData }: Props) => {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(true);
  }, [keyData]);

  function handleClose() {
    setOpen(false);
  }

  return (
    <QueryProvider
      apiUrl={uiProps.apiUrl}
      apiKey={uiProps.apiKey}
      projectId={uiProps.projectId}
    >
      {open && (
        <DialogProvider
          uiProps={uiProps}
          defaultValue={keyData.defaultValue || ''}
          keyName={keyData.key!}
          fallbackNamespaces={keyData.fallbackNamespaces}
          namespace={keyData.namespace}
          onClose={handleClose}
        >
          <TranslationDialog />
        </DialogProvider>
      )}
    </QueryProvider>
  );
};
