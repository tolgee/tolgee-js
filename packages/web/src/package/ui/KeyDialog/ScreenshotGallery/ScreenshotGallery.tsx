import React, { useRef, useState } from 'react';
import { styled, CircularProgress, IconButton } from '@mui/material';
import { CameraAlt, AddCircleOutline } from '@mui/icons-material';

import { ScreenshotDropzone } from './ScreenshotDropzone';
import { ScreenshotThumbnail } from './ScreenshotThumbnail';
import { MAX_FILE_COUNT } from './utils';
import { useDialogContext, useDialogActions } from '../dialogContext';
import { ScreenshotDetail } from './ScreenshotDetail';
import { ScFieldTitle } from '../../common/FieldTitle';
import { ExtensionPrompt } from './ExtensionPrompt';
import { Tooltip } from '../../common/Tooltip';

const ScPlaceholder = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-grow: 1;
  border: 1px dashed lightgrey;
`;

const ScScreenshotDummy = styled('div')`
  display: flex;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  margin: 1px;
`;

const ScHeading = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const ScControls = styled('div')`
  display: flex;
`;

const ScText = styled('div')`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const ALLOWED_UPLOAD_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

export const ScreenshotGallery: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    handleUploadImages,
    handleRemoveScreenshot,
    handleTakeScreenshot,
    setScreenshotDetail,
  } = useDialogActions();

  const keyId = useDialogContext((c) => c.keyData?.keyId);
  const screenshots = useDialogContext((c) => c.screenshots);
  const screenshotDetails = useDialogContext((c) => c.screenshotDetail);
  const canTakeScreenshots = useDialogContext((c) => c.canTakeScreenshots);
  const screenshotsUploading = useDialogContext((c) => c.screenshotsUploading);
  const permissions = useDialogContext((c) => c.permissions);

  const [extensionPrompt, setExtensionPrompt] = useState(false);

  const uploadEnabled = permissions.canUploadScreenshots;
  const deleteEnabled = permissions.canDeleteScreenshots;

  function onFileSelected(e: React.SyntheticEvent) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) {
      return;
    }
    const toUpload: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const item = files.item(i);
      if (item) {
        toUpload.push(item);
      }
    }
    validateAndUpload(toUpload);
  }
  const validate = (files: File[]) => {
    const errors: string[] = [];

    if (files.length > MAX_FILE_COUNT) {
      errors.push('Too many files');
    }

    files.forEach((file) => {
      if (ALLOWED_UPLOAD_TYPES.indexOf(file.type) < 0) {
        errors.push(`${file.name}: unsupported format`);
      }
    });

    const valid = errors.length === 0;

    return { errors, valid };
  };

  const validateAndUpload = (files: File[]) => {
    const { valid } = validate(files);
    if (valid) {
      handleUploadImages(files);
    }
  };

  const onFileSelect = () => {
    fileRef.current?.dispatchEvent(new MouseEvent('click'));
  };

  const ableToTakeScreenshot = canTakeScreenshots;

  // @ts-ignore
  const isChrome = Boolean(window.chrome);

  return (
    <>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileRef}
        onChange={(e) => onFileSelected(e)}
        multiple
        accept={ALLOWED_UPLOAD_TYPES.join(',')}
      />

      <ScHeading>
        <ScFieldTitle>Screenshots</ScFieldTitle>
        <ScControls>
          {uploadEnabled && (
            <>
              {(isChrome || ableToTakeScreenshot) && (
                <Tooltip title="Take screenshot">
                  <IconButton
                    sx={{ fontSize: 24 }}
                    onClick={
                      ableToTakeScreenshot
                        ? handleTakeScreenshot
                        : () => setExtensionPrompt(true)
                    }
                  >
                    <CameraAlt />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Add image">
                <IconButton sx={{ fontSize: 24 }} onClick={onFileSelect}>
                  <AddCircleOutline />
                </IconButton>
              </Tooltip>
            </>
          )}
        </ScControls>
      </ScHeading>

      <ScreenshotDropzone
        validateAndUpload={validateAndUpload}
        enabled={uploadEnabled}
      >
        {screenshots.length
          ? screenshots.map((ss) => (
              <ScreenshotThumbnail
                key={ss.id}
                keyId={keyId}
                data={ss}
                onClick={() => setScreenshotDetail(ss)}
                onDelete={
                  deleteEnabled || ss.justUploaded
                    ? handleRemoveScreenshot
                    : undefined
                }
              />
            ))
          : null}
        {screenshotsUploading && (
          <ScScreenshotDummy>
            <CircularProgress />
          </ScScreenshotDummy>
        )}
        {!screenshots.length && !screenshotsUploading && (
          <ScPlaceholder
            style={{ cursor: uploadEnabled ? 'pointer' : 'default' }}
            onClick={uploadEnabled ? onFileSelect : undefined}
          >
            <ScText>
              There are no screenshots.
              {ableToTakeScreenshot &&
                uploadEnabled &&
                ' Take screenshot by camera icon.'}
            </ScText>
            {uploadEnabled && (
              <ScText>Add some by dropping or clicking on plus.</ScText>
            )}
          </ScPlaceholder>
        )}
      </ScreenshotDropzone>
      {screenshotDetails && (
        <ScreenshotDetail
          keyId={keyId}
          screenshot={screenshotDetails}
          onClose={() => setScreenshotDetail(null)}
        />
      )}
      {extensionPrompt && (
        <ExtensionPrompt onClose={() => setExtensionPrompt(false)} />
      )}
    </>
  );
};
