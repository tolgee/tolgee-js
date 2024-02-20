import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Code from '@mui/icons-material/Code';

import { StateInType, StateType } from '../State/translationStates';
import { ControlsButton } from '../State/ControlsButton';
import { StateTransitionButtons } from '../State/StateTransitionButtons';

const StyledContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledIcons = styled('div')`
  display: flex;
  gap: 16px;
  padding-right: 4px;
`;

type ControlsProps = {
  state?: StateType;
  mode?: 'placeholders' | 'plain';
  isBaseLanguage?: boolean;
  stateChangeEnabled?: boolean;
  onStateChange?: (state: StateInType) => void;
  onModeToggle?: () => void;
  controlsProps?: React.ComponentProps<typeof Box>;
  language: string | undefined;
};

export const ControlsEditorSmall: React.FC<ControlsProps> = ({
  state,
  mode,
  stateChangeEnabled,
  onModeToggle,
  onStateChange,
  controlsProps,
  language,
}) => {
  const displayTransitionButtons = state && stateChangeEnabled;

  return (
    <StyledContainer {...controlsProps}>
      <StyledIcons>
        {onModeToggle && (
          <ControlsButton
            onClick={onModeToggle}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            color={mode === 'placeholders' ? 'default' : 'primary'}
            data-cy="translations-cell-switch-mode"
            tooltip={
              mode === 'placeholders'
                ? 'Hide placeholders'
                : 'Display placeholders'
            }
          >
            <Code style={{ fontSize: 19 }} />
          </ControlsButton>
        )}

        {displayTransitionButtons && (
          <StateTransitionButtons
            state={state}
            onStateChange={onStateChange}
            language={language}
          />
        )}
      </StyledIcons>
    </StyledContainer>
  );
};
