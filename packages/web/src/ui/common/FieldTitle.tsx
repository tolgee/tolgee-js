import { styled } from '@mui/material';
import { HTMLFactory } from 'react';

export const ScFieldTitle = styled('div')`
  display: flex;
  margin-top: 16px;
  margin-bottom: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  justify-content: space-between;
` as unknown as HTMLFactory<HTMLDivElement>;
