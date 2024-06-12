import { Tooltip as TooltipMui } from '@mui/material';
import { DEVTOOLS_Z_INDEX } from '../../constants';
import { getRootElement } from '../getRootElement';

type Props = React.ComponentProps<typeof TooltipMui>;

export const Tooltip = (props: Props) => {
  return (
    <TooltipMui
      disableInteractive
      PopperProps={{
        container: getRootElement() as unknown as Element,
        style: { zIndex: DEVTOOLS_Z_INDEX },
      }}
      {...props}
    />
  );
};
