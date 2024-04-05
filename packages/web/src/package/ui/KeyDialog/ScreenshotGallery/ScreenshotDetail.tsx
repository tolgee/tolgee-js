import React from 'react';
import { Dialog, Box } from '@mui/material';

import { ScreenshotInterface } from '../dialogContext/useGallery';
import { DEVTOOLS_Z_INDEX } from '../../../constants';
import { ScreenshotWithLabels } from './ScreenshotWithLabels';

type Props = {
  screenshot: ScreenshotInterface;
  keyId: number | undefined;
  onClose: () => void;
};

export const ScreenshotDetail: React.FC<Props> = ({
  keyId,
  screenshot,
  onClose,
}) => {
  return (
    <Dialog
      open={true}
      disablePortal
      disableEnforceFocus
      maxWidth="lg"
      style={{ zIndex: DEVTOOLS_Z_INDEX }}
      onClose={onClose}
    >
      <Box display="grid">
        {screenshot && (
          <ScreenshotWithLabels
            showTooltips
            screenshot={{
              src: screenshot.fileUrl,
              width: screenshot.width,
              height: screenshot.height,
              highlightedKeyId: keyId ?? -1,
              keyReferences: screenshot.keyReferences,
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};
