import React from 'react';
import { Box } from '@mui/material';

import { StateInType, TRANSLATION_STATES } from './translationStates';
import { components } from '../../client/apiSchema.generated';
import { ControlsButton } from './ControlsButton';
import { StateIcon } from './StateIcon';

type State = components['schemas']['TranslationViewModel']['state'];

type Props = {
  state: State | undefined;
  onStateChange?: (s: StateInType) => void;
  className?: string;
  disabled?: boolean;
  language: string | undefined;
};

export const StateTransitionButtons: React.FC<Props> = ({
  state,
  onStateChange,
  className,
  disabled,
  language,
}) => {
  const nextState = TRANSLATION_STATES[state || 'TRANSLATED']?.next;
  const nextFallbacked = nextState ?? TRANSLATION_STATES['TRANSLATED']?.next;

  return (
    <>
      {nextFallbacked && (
        <ControlsButton
          data-cy="translation-state-button"
          data-cy-language={language}
          onClick={() => onStateChange?.(nextFallbacked)}
          className={className}
          tooltip={
            <Box sx={{ whiteSpace: 'nowrap' }}>
              Mark as {TRANSLATION_STATES[nextFallbacked].name}
            </Box>
          }
          disabled={disabled || !nextState}
        >
          <StateIcon state={state} />
        </ControlsButton>
      )}
    </>
  );
};
