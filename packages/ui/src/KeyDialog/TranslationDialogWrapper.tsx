import React from 'react';
import { Dialog } from '@mui/material';

import { DialogContextType } from './TranslationDialogContextProvider';
import { NewWindow } from '../common/NewWindow';
import { DEVTOOLS_Z_INDEX } from '../constants';

export const TranslationDialogWrapper: React.FC<{
  context: DialogContextType;
}> = ({ context, ...props }) => {
  return (
    <>
      {context.useBrowserWindow ? (
        context.open ? (
          <NewWindow>{props.children}</NewWindow>
        ) : null
      ) : (
        !context.takingScreenshot && (
          <Dialog
            disablePortal
            disableEnforceFocus
            open={context.open}
            onClose={context.onClose}
            aria-labelledby="form-dialog-title"
            maxWidth="lg"
            style={{ zIndex: DEVTOOLS_Z_INDEX }}
          >
            <>{props.children}</>
          </Dialog>
        )
      )}
    </>
  );
};
