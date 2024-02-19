import React from 'react';
import Box from '@mui/material/Box';

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
  const nextState = state && TRANSLATION_STATES[state]?.next;

  return (
    <>
      {nextState && (
        <ControlsButton
          data-cy="translation-state-button"
          data-cy-language={language}
          onClick={() => onStateChange?.(nextState)}
          className={className}
          tooltip={
            <Box sx={{ whiteSpace: 'nowrap' }}>
              Mark as {TRANSLATION_STATES[nextState].name}
            </Box>
          }
          disabled={disabled}
        >
          <StateIcon state={state} />
        </ControlsButton>
      )}
    </>
  );
};
