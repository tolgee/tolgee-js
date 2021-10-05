import * as React from 'react';
import { DialogContextType } from './TranslationDialogContextProvider';
import { NewWindow } from '../common/NewWindow';
import { Modal } from '../common/Modal';
import { StylesContextProvider } from '../common/styles/StylesContextProvider';

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
              open={context.open}
              onClose={context.onClose}
              aria-labelledby="form-dialog-title"
              style={{
                width: 700,
              }}
            >
              {props.children}
            </Modal>
          )
        )}
      </>
    </StylesContextProvider>
  );
};
