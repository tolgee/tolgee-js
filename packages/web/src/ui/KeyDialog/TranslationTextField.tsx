import React, { useRef } from 'react';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { components } from '../client/apiSchema.generated';
import { StateType, TRANSLATION_STATES } from './State/translationStates';
import { StateTransitionButtons } from './State/StateTransitionButtons';
import { DEVTOOLS_Z_INDEX } from '../../constants';
import { Editor } from '../editor/Editor';
import { EditorWrapper } from '../editor/EditorWrapper';

type State = components['schemas']['TranslationModel']['state'];

const StyledContainer = styled('div')`
  position: relative;
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
      <EditorWrapper>
        <Editor
          direction="ltr"
          mode="placeholders"
          locale={language}
          value={value}
          onChange={onChange}
        />
      </EditorWrapper>
      {/* <StyledTextField
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
      /> */}
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
