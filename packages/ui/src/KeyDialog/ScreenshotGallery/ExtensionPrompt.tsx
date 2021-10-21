import React, { useEffect, useState } from 'react';
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
  const [installClicked, setInstallClicked] = useState(false);

  const onReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    const handler = () => {
      setInstallClicked(true);
    };
    // act like extension was installed after user returns to this window
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  return (
    <Dialog
      open={true}
      disableEnforceFocus
      disablePortal
      style={{ zIndex: DEVTOOLS_Z_INDEX }}
      onClose={onClose}
    >
      {installClicked ? (
        <>
          <DialogContent>
            <ScTitle>Browser extension required</ScTitle>
            <ScText>
              After installing the extension, you need to reload this page.
            </ScText>
          </DialogContent>
          <ScControls>
            <Button onClick={onReload} color="primary" variant="contained">
              Reload
            </Button>
          </ScControls>
        </>
      ) : (
        <>
          <DialogContent>
            <ScTitle>Browser extension required</ScTitle>
            <ScText>
              To make automatic screenshots please install Tolgee browser
              extension.
            </ScText>
          </DialogContent>
          <ScControls>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button
              component="a"
              color="primary"
              variant="contained"
              style={{ marginLeft: 10 }}
              href={CHROME_EXTENSION_LINK}
              rel="noreferrer noopener"
              target="_blank"
            >
              Install
            </Button>
          </ScControls>
        </>
      )}
    </Dialog>
  );
};
