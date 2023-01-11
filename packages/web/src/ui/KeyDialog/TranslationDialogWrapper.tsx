import React from 'react';
import Dialog from '@mui/material/Dialog';

import { useDialogContext, useDialogActions } from './dialogContext';
import { NewWindow } from './NewWindow';
import { DEVTOOLS_Z_INDEX } from '../../constants';

export const TranslationDialogWrapper: React.FC = ({ children }) => {
  const { onClose } = useDialogActions();
  const useBrowserWindow = useDialogContext((c) => c.useBrowserWindow);
  const open = useDialogContext((c) => c.open);
  const takingScreenshot = useDialogContext((c) => c.takingScreenshot);

  return (
    <>
      {useBrowserWindow ? (
        <NewWindow>{children}</NewWindow>
      ) : (
        <Dialog
          disableRestoreFocus
          disablePortal
          disableEnforceFocus
          open={open}
          onClose={onClose}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
          style={{
            zIndex: DEVTOOLS_Z_INDEX,
            visibility: takingScreenshot ? 'hidden' : 'visible',
          }}
        >
          <>{children}</>
        </Dialog>
      )}
    </>
  );
};
