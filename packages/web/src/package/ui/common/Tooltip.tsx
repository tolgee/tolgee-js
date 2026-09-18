import { Tooltip as TooltipMui } from '@mui/material';
import { DEVTOOLS_Z_INDEX } from '../../constants';
import { getRootElement } from '../getRootElement';

type Props = React.ComponentProps<typeof TooltipMui>;

// A top-layer <dialog> paints above everything outside it regardless of
// z-index, so tooltips used inside the editor must be portaled into it.
const getContainer = () => {
  const root = getRootElement();
  return root.querySelector('dialog[open]') ?? root;
};

export const Tooltip = (props: Props) => {
  return (
    <TooltipMui
      disableInteractive
      PopperProps={{
        container: getContainer,
        style: { zIndex: DEVTOOLS_Z_INDEX },
      }}
      {...props}
    />
  );
};
