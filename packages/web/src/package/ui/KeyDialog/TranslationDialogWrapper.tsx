import React from 'react';
import { Dialog } from '@mui/material';

import { useDialogContext, useDialogActions } from './dialogContext';
import { NewWindow } from './NewWindow';
import { DEVTOOLS_Z_INDEX } from '../../constants';

export const TranslationDialogWrapper = ({
  children,
}: React.PropsWithChildren) => {
  const { onClose } = useDialogActions();
  const useBrowserWindow = useDialogContext((c) => c.useBrowserWindow);
  const takingScreenshot = useDialogContext((c) => c.takingScreenshot);

  return (
    <>
      {useBrowserWindow ? (
        <NewWindow>{children}</NewWindow>
      ) : (
        <Dialog
          disableRestoreFocus
          disableEnforceFocus
          disablePortal
          open={true}
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
