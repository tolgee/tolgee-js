import clsx from 'clsx';
import React, { useState } from 'react';
import { styled } from '@mui/material';
import { Backup, HighlightOff } from '@mui/icons-material';
import { green, red } from '@mui/material/colors';

import { MAX_FILE_COUNT, dataTransferItemsToArray } from './utils';

export interface ScreenshotDropzoneProps {
  validateAndUpload: (files: File[]) => void;
  enabled: boolean;
}

const ScContainer = styled('div')`
  position: relative;
  display: flex;
  overflow: visible;
  flex-wrap: wrap;
`;

const ScDropZoneValidation = styled('div')`
  border: 1px dashed lightgrey;
  z-index: 2;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  &.valid {
    backdrop-filter: blur(5px);
    border: 1px solid ${green[200]};
    background-color: ${green[50]};
    opacity: 0.9;
  }
  &.invalid {
    border: 1px solid ${red[200]};
    opacity: 0.9;
    background-color: ${red[50]};
    backdrop-filter: blur(5px);
  }
`;

const ScValidIcon = styled(Backup)`
  filter: drop-shadow(1px 1px 0px ${green[200]})
    drop-shadow(-1px 1px 0px ${green[200]})
    drop-shadow(1px -1px 0px ${green[200]})
    drop-shadow(-1px -1px 0px ${green[200]});
  font-size: 100;
  color: ${({ theme }) => theme.palette.common.white};
`;

const ScInvalidIcon = styled(HighlightOff)`
  filter: drop-shadow(1px 1px 0px ${red[200]})
    drop-shadow(-1px 1px 0px ${red[200]}) drop-shadow(1px -1px 0px ${red[200]})
    drop-shadow(-1px -1px 0px ${red[200]});
  font-size: 100;
  color: ${({ theme }) => theme.palette.common.white};
`;

export const ScreenshotDropzone = ({
  validateAndUpload,
  enabled,
  ...props
}: React.PropsWithChildren<ScreenshotDropzoneProps>) => {
  const [dragOver, setDragOver] = useState(null as null | 'valid' | 'invalid');
  const [dragEnterTarget, setDragEnterTarget] = useState(
    null as EventTarget | null
  );

  const onDragEnter = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDragEnterTarget(e.target);
    if (e.dataTransfer.items) {
      const files = dataTransferItemsToArray(e.dataTransfer.items);
      if (files.length > MAX_FILE_COUNT) {
        setDragOver('invalid');
        return;
      }
      setDragOver('valid');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target === dragEnterTarget) {
      setDragOver(null);
    }
  };

  const onDrop = async (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer.items) {
      const files = dataTransferItemsToArray(e.dataTransfer.items);
      validateAndUpload(files);
    }
    setDragOver(null);
  };

  let dropZoneAllowedProps = {} as any;
  if (enabled) {
    dropZoneAllowedProps = {
      onDrop,
      onDragEnter,
      onDragLeave,
      onDragOver,
    };
  }

  return (
    <>
      <ScContainer {...dropZoneAllowedProps} data-cy="dropzone">
        <ScDropZoneValidation
          className={clsx({
            valid: dragOver === 'valid',
            invalid: dragOver === 'invalid',
          })}
        >
          {dragOver === 'valid' && <ScValidIcon />}
          {dragOver === 'invalid' && <ScInvalidIcon />}
        </ScDropZoneValidation>
        {props.children}
      </ScContainer>
    </>
  );
};
