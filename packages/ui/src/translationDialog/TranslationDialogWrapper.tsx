import { DialogContextType } from './TranslationDialogContextProvider';
import { NewWindow } from '../common/NewWindow';
import { Modal } from '../common/Modal';
import { FC } from 'react';
import { StylesContextProvider } from '../common/styles/StylesContextProvider';
import * as React from 'react';

export const TranslationDialogWrapper: FC<{ context: DialogContextType }> = ({
  context,
  ...props
}) => {
  return context.useBrowserWindow ? (
    context.open ? (
      <NewWindow>{props.children}</NewWindow>
    ) : null
  ) : (
    <Modal
      open={context.open}
      onClose={context.onClose}
      aria-labelledby="form-dialog-title"
      style={{ width: '700px' }}
    >
      <StylesContextProvider>{props.children}</StylesContextProvider>
    </Modal>
  );
};
