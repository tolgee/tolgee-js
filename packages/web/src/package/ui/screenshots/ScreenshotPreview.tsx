import React from 'react';
import { styled } from '@mui/material';

const Img = styled('img')`
  width: 100px;
  height: 100px;
  object-fit: contain;
  padding: 2px;
  box-sizing: 'border-box';
`;

type Props = {
  url: string;
};

export const ScreenshotPreview: React.FC<Props> = ({ url }) => {
  return <Img src={url} />;
};
