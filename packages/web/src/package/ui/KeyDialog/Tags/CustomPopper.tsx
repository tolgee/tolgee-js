import React from 'react';
import { Popper } from '@mui/material';

type Props = React.ComponentProps<typeof Popper>;

export const CustomPopper: React.FC<Props> = ({ children, ...props }) => {
  return (
    // override width, so it can be wider than ref element
    <Popper
      {...props}
      disablePortal
      style={{ minWidth: props.style?.width }}
      placement="bottom-start"
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: () => {
              // offset from top
              return [0, 3];
            },
          },
        },
      ]}
    >
      {children}
    </Popper>
  );
};
