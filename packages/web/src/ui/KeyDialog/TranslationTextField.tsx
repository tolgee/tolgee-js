import React, { useRef } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { inputBaseClasses } from '@mui/material/InputBase';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import Tooltip from '@mui/material/Tooltip';

import { components } from '../client/apiSchema.generated';
import { StateType, TRANSLATION_STATES } from './State/translationStates';
import { StateTransitionButtons } from './State/StateTransitionButtons';
import { DEVTOOLS_Z_INDEX } from '../../constants';

type State = components['schemas']['TranslationModel']['state'];

const StyledContainer = styled('div')`
  position: relative;
`;

const StyledTextField = styled(TextField)`
  position: relative;
  margin: 0px;

  & .Mui-disabled {
    background: ${({ theme }) => theme.palette.grey[200]};
  }

  & .${inputBaseClasses.root} .${inputBaseClasses.input} {
    padding-bottom: 16px;
    min-height: 30px;
    height: unset;
  }

  & .${inputBaseClasses.root}:hover .${outlinedInputClasses.notchedOutline} {
    border-color: ${({ theme }) => theme.palette.grey[500]};
  }

  &
    .${inputBaseClasses.root}:focus-within
    .${outlinedInputClasses.notchedOutline} {
    border-color: ${({ theme }) => theme.palette.grey[900]};
    border-width: 1px;
  }
`;

const StyledStateIndicator = styled('div')`
  position: absolute;
  left: 1px;
  top: 1px;
  bottom: 1px;
  width: 5px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
`;

const StyledControls = styled('div')`
  position: absolute;
  bottom: 1px;
  right: 1px;
  margin: 10px;
`;

type Props = {
  disabled?: boolean;
  stateChangeDisabled: boolean;
  language?: string;
  value: string;
  onChange: (val: string) => void;
  onStateChange: (val: StateType) => void;
  state?: State;
};

export const TranslationTextField = ({
  disabled,
  stateChangeDisabled,
  language,
  value,
  onChange,
  onStateChange,
  state,
}: Props) => {
  const normalized = state === 'UNTRANSLATED' ? undefined : state;
  const fallbackedState = value ? normalized ?? 'TRANSLATED' : 'UNTRANSLATED';
  const textFieldRef = useRef<HTMLDivElement>(null);
  return (
    <StyledContainer>
      <StyledTextField
        size="small"
        disabled={disabled}
        inputProps={{
          lang: language,
          ref: textFieldRef,
        }}
        maxRows={Infinity}
        multiline
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Tooltip
        disableInteractive
        title={TRANSLATION_STATES[fallbackedState]?.name}
        PopperProps={{
          disablePortal: true,
          style: { zIndex: DEVTOOLS_Z_INDEX },
        }}
      >
        <StyledStateIndicator
          style={{
            background: TRANSLATION_STATES[fallbackedState]?.color,
          }}
          onClick={() => {
            textFieldRef.current?.focus();
          }}
        />
      </Tooltip>

      <StyledControls>
        <StateTransitionButtons
          state={fallbackedState}
          onStateChange={onStateChange}
          disabled={stateChangeDisabled}
          language={language!}
        />
      </StyledControls>
    </StyledContainer>
  );
};
