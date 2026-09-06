import React, { useEffect, useRef } from 'react';
import { Dialog, GlobalStyles } from '@mui/material';

import { useDialogContext, useDialogActions } from './dialogContext';
import { NewWindow } from './NewWindow';
import { DEVTOOLS_Z_INDEX } from '../../constants';

const TOP_LAYER_CLASS = 'tolgee-key-dialog-top-layer';

export const TranslationDialogWrapper = ({
  children,
}: React.PropsWithChildren) => {
  const { onClose } = useDialogActions();
  const useBrowserWindow = useDialogContext((c) => c.useBrowserWindow);
  const takingScreenshot = useDialogContext((c) => c.takingScreenshot);
  const nativeDialogRef = useRef<HTMLDialogElement>(null);

  // Promote the editor into the browser top layer so it paints above and
  // takes focus from any modal <dialog> the host app may have open.
  useEffect(() => {
    if (useBrowserWindow) return;
    const dialog = nativeDialogRef.current;
    if (!dialog) return;
    if (!dialog.open) {
      dialog.showModal();
    }
    const handleCancel = (e: Event) => {
      // Defer to the existing Escape handler in dialogContext so close flow
      // stays in one place; prevent the browser from closing the dialog itself.
      e.preventDefault();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      if (dialog.open) dialog.close();
    };
  }, [useBrowserWindow]);

  if (useBrowserWindow) {
    return <NewWindow>{children}</NewWindow>;
  }

  return (
    <>
      <GlobalStyles
        styles={{
          [`dialog.${TOP_LAYER_CLASS}`]: {
            padding: 0,
            border: 0,
            margin: 0,
            inset: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: 'none',
            maxHeight: 'none',
            background: 'transparent',
            color: 'inherit',
            overflow: 'visible',
            // Let pointer events fall through to MUI's backdrop/paper, which
            // already handle outside-click-to-close.
            pointerEvents: 'none',
          },
          [`dialog.${TOP_LAYER_CLASS}::backdrop`]: {
            background: 'transparent',
          },
          [`dialog.${TOP_LAYER_CLASS} > *`]: {
            pointerEvents: 'auto',
          },
        }}
      />
      <dialog ref={nativeDialogRef} className={TOP_LAYER_CLASS}>
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
      </dialog>
    </>
  );
};
