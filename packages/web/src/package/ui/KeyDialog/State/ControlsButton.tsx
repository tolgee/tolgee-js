import React from 'react';
import { styled, IconButton } from '@mui/material';
import { Tooltip } from '../../common/Tooltip';

const StyledIconButton = styled(IconButton)`
  display: flex;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin: -8px;
`;

type Props = React.ComponentProps<typeof IconButton> & {
  tooltip?: React.ReactNode;
};

export const ControlsButton: React.FC<Props> = function ControlsButton({
  children,
  className,
  onClick,
  tooltip,
  ...props
}) {
  const content = (
    <StyledIconButton
      size="small"
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledIconButton>
  );

  return tooltip && !props.disabled ? (
    <Tooltip title={tooltip}>{content}</Tooltip>
  ) : (
    content
  );
};
