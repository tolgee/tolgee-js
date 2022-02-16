import React from 'react';
import { Dialog } from '@mui/material';

import {
  useDialogContext,
  useDialogDispatch,
} from './TranslationDialogContextProvider';
import { NewWindow } from './NewWindow';
import { DEVTOOLS_Z_INDEX } from '../constants';

export const TranslationDialogWrapper: React.FC = ({ children }) => {
  const dispatch = useDialogDispatch();
  const useBrowserWindow = useDialogContext((c) => c.useBrowserWindow);
  const open = useDialogContext((c) => c.open);
  const takingScreenshot = useDialogContext((c) => c.takingScreenshot);

  const onClose = () => {
    dispatch({ type: 'ON_CLOSE' });
  };

  return (
    <>
      {useBrowserWindow ? (
        <NewWindow>{children}</NewWindow>
      ) : (
        !takingScreenshot && (
          <Dialog
            disablePortal
            disableEnforceFocus
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
            maxWidth="lg"
            style={{ zIndex: DEVTOOLS_Z_INDEX }}
          >
            <>{children}</>
          </Dialog>
        )
      )}
    </>
  );
};
