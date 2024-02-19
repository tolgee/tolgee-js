import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { components } from '../../client/apiSchema.generated';
import React from 'react';

type State = components['schemas']['TranslationViewModel']['state'];

type StateButtonProps = React.ComponentProps<typeof CheckCircleOutlined> & {
  state: State | undefined;
};

export const StateIcon = ({ state, ...props }: StateButtonProps) => {
  const additionalProps = { sx: { fontSize: 19 } };
  switch (state) {
    case 'REVIEWED':
      return <CheckCircle {...props} {...additionalProps} />;
    default:
      return <CheckCircleOutlined {...props} {...additionalProps} />;
  }
};
