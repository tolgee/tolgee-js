import React from 'react';
import clsx from 'clsx';
import { Add } from '@mui/icons-material';
import { styled } from '@mui/material';

import { Wrapper } from './Wrapper';

const StyledAddIcon = styled(Add)`
  font-size: 16px;
  padding: 2px;
  width: 20px;
  height: 20px;
`;

const StyledLabel = styled('div')`
  margin-top: -2px;
  margin-right: 6px;
`;

type Props = {
  onClick: () => void;
  withFullLabel: boolean;
  className?: string;
};

export const TagAdd: React.FC<Props> = ({
  onClick,
  withFullLabel,
  className,
}) => {
  return (
    <Wrapper role="add" onClick={onClick} className={clsx(className)}>
      <StyledAddIcon data-cy="translations-tags-add" />
      {withFullLabel && <StyledLabel>tag</StyledLabel>}
    </Wrapper>
  );
};
