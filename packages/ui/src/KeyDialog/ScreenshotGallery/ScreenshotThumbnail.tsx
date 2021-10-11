import React, { useState } from 'react';
import { Tooltip, IconButton, styled } from '@mui/material';
import { Clear } from '@mui/icons-material';
import clsx from 'clsx';
import { ScreenshotInterface } from '../TranslationDialogContextProvider';
import { DEVTOOLS_Z_INDEX } from '../../constants';

const Screenshot = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  transition: transform 0.1s, filter 0.5s;
  &:hover {
    transform: scale(1.1);
  }
`;

const ScreenshotBox = styled('div')`
  position: relative;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 1px;
  cursor: pointer;
  overflow: visible;
`;

const ScreenshotOverflowWrapper = styled('div')`
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const DeleteIconButton = styled(IconButton)`
  position: absolute;
  z-index: 2;
  font-size: 20px;
  right: -8px;
  top: -8px;
  padding: 2px;
  background-color: rgba(62, 62, 62, 0.9);
  color: rgba(255, 255, 255, 0.8);
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.1s linear, opacity 0.1s linear;
  &:hover {
    background-color: rgba(62, 62, 62, 1);
    color: rgba(255, 255, 255, 0.9);
  }
  &.hover {
    opacity: 1;
    visibility: visible;
  }
`;

const DeleteIcon = styled(Clear)`
  font-size: 20px;
`;

export type Props = {
  onClick: () => void;
  onDelete: (id: number) => void;
  data: ScreenshotInterface;
};

export const ScreenshotThumbnail: React.FC<Props> = (props) => {
  const [hover, setHover] = useState(false);

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(false);
  };

  const onDeleteClick = () => {
    props.onDelete(props.data.id);
  };

  return (
    <ScreenshotBox onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      {props.onDelete && (
        <Tooltip
          title="Delete"
          PopperProps={{
            disablePortal: true,
            style: { zIndex: DEVTOOLS_Z_INDEX },
          }}
        >
          <DeleteIconButton onClick={onDeleteClick} className={clsx({ hover })}>
            <DeleteIcon />
          </DeleteIconButton>
        </Tooltip>
      )}

      <ScreenshotOverflowWrapper key={props.data.id} onClick={props.onClick}>
        <Screenshot
          onMouseDown={(e) => e.preventDefault()}
          src={props.data.fileUrl}
          aria-label="Screenshot"
        />
      </ScreenshotOverflowWrapper>
    </ScreenshotBox>
  );
};
