import React from 'react';
import { styled } from '@mui/material';
import { Close } from '@mui/icons-material';

const StyledCloseIcon = styled(Close)`
  font-size: 20px;
  cursor: pointer;
  padding: 2px;
`;

type Props = {
  onClick?: React.MouseEventHandler<SVGElement>;
};

export const CloseButton: React.FC<Props> = ({ onClick }) => {
  return (
    <StyledCloseIcon
      role="button"
      data-cy="translations-tag-close"
      onClick={onClick}
    />
  );
};
