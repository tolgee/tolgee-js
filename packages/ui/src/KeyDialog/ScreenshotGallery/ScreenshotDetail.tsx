import React from 'react';
import { Dialog, styled } from '@mui/material';
import { ScreenshotInterface } from '../TranslationDialogContextProvider';
import { DEVTOOLS_Z_INDEX } from '../../constants';

const ScImg = styled('img')`
  width: 80vw;
  height: 80vh;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

type Props = {
  screenshot: ScreenshotInterface;
  onClose: () => void;
};

export const ScreenshotDetail: React.FC<Props> = ({ screenshot, onClose }) => {
  return (
    <Dialog
      open={true}
      disablePortal
      disableEnforceFocus
      maxWidth="lg"
      style={{ zIndex: DEVTOOLS_Z_INDEX }}
      onClose={onClose}
    >
      <ScImg src={screenshot.fileUrl} />
    </Dialog>
  );
};
