import React from 'react';
import Dialog from '@mui/material/Dialog';
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
      <div>
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
      </div>
    </Dialog>
  );
};
