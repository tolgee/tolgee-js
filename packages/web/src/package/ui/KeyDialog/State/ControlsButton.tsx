import React from 'react';
import { styled, IconButton, Tooltip } from '@mui/material';

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

  return tooltip && !props.disabled ? (
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
