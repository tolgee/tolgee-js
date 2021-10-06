import React from 'react';

import { DialogContextType } from './TranslationDialogContextProvider';
import { NewWindow } from '../common/NewWindow';
import { StylesContextProvider } from '../common/styles/StylesContextProvider';
import { Modal } from '../common/Modal';

export const TranslationDialogWrapper: React.FC<{
  context: DialogContextType;
}> = ({ context, ...props }) => {
  return (
    <StylesContextProvider>
      <>
        {context.useBrowserWindow ? (
          context.open ? (
            <NewWindow>{props.children}</NewWindow>
          ) : null
        ) : (
          !context.takingScreenshot && (
            <Modal
              style={{ width: 700 }}
              open={context.open}
              onClose={context.onClose}
              aria-labelledby="form-dialog-title"
            >
              {props.children}
            </Modal>
          )
        )}
      </>
    </StylesContextProvider>
  );
};
