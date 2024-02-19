import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { DEVTOOLS_Z_INDEX } from '../../../constants';

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

  return tooltip ? (
    <Tooltip
      disableInteractive
      title={tooltip}
      PopperProps={{
        disablePortal: true,
        style: { zIndex: DEVTOOLS_Z_INDEX },
      }}
    >
      {content}
    </Tooltip>
  ) : (
    content
  );
};
