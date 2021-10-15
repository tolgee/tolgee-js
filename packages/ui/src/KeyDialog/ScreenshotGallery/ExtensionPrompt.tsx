import React from 'react';
import { Button, Dialog, DialogContent, styled } from '@mui/material';

import { DEVTOOLS_Z_INDEX, CHROME_EXTENSION_LINK } from '../../constants';

type Props = {
  onClose: () => void;
};

const ScTitle = styled('div')`
  display: flex;
  margin: 0px 0px 26px 0px;
  font-size: 19px;
`;

const ScText = styled('div')`
  margin: 8px 0px;
`;

const ScControls = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin: ${({ theme }) => theme.spacing(1)};
  min-height: 36px;
`;

export const ExtensionPrompt: React.FC<Props> = ({ onClose }) => {
  return (
    <Dialog
      open={true}
      disableEnforceFocus
      disablePortal
      style={{ zIndex: DEVTOOLS_Z_INDEX }}
      onClose={onClose}
    >
      <DialogContent>
        <ScTitle>Browser extension required</ScTitle>
        <ScText>
          To make automatic screenshots please install Tolgee browser extension.
        </ScText>
      </DialogContent>
      <ScControls>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          LinkComponent="a"
          href={CHROME_EXTENSION_LINK}
          target="_blank"
          rel="noreferrer noopener"
          variant="contained"
          type="primary"
          style={{ marginLeft: '10px' }}
        >
          Install
        </Button>
      </ScControls>
    </Dialog>
  );
};
