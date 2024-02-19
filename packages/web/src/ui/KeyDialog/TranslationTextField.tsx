import React, { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { components } from '../client/apiSchema.generated';
import { TRANSLATION_STATES } from '../editor/State/translationStates';
import { DEVTOOLS_Z_INDEX } from '../../constants';
import { TolgeeFormat } from '@tginternal/editor';
import { PluralEditor } from '../editor/PluralEditor';
import { ControlsEditorSmall } from '../editor/ControlsEditorSmall';
import { ScFieldTitle } from '../common/FieldTitle';
import clsx from 'clsx';

type State = components['schemas']['TranslationModel']['state'];

const StyledContainer = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;

  &.disabled {
    opacity: 0.5;
  }

  &.disabled .cm-cursor {
    display: none !important;
  }
`;

const StyledStateIndicator = styled('div')`
  margin-top: 4px;
  width: 5px;
`;

type Props = {
  disabled?: boolean;
  language?: string;
  value: TolgeeFormat;
  onChange: (val: TolgeeFormat) => void;
  state?: State;
  onStateChange: (value: State) => void;
  stateChangePermitted?: boolean;
};

export const TranslationTextField = ({
  disabled,
  language,
  value,
  state,
  stateChangePermitted,
  onChange,
  onStateChange,
}: Props) => {
  const normalized = state === 'UNTRANSLATED' ? undefined : state;
  const fallbackedState = value ? normalized ?? 'TRANSLATED' : 'UNTRANSLATED';
  const textFieldRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'placeholders' | 'plain'>('placeholders');
  return (
    <>
      <ScFieldTitle>
        <div>{language}</div>
        {!disabled && (
          <ControlsEditorSmall
            state={state}
            onStateChange={(value) => onStateChange(value)}
            language={language}
            stateChangeEnabled={stateChangePermitted}
            mode={mode}
            onModeToggle={() =>
              setMode(mode === 'plain' ? 'placeholders' : 'plain')
            }
          />
        )}
      </ScFieldTitle>
      <StyledContainer className={clsx({ disabled })}>
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
        <PluralEditor
          value={value ?? { variants: { other: '' } }}
          onChange={onChange}
          locale={language!}
          editorProps={{ direction: 'ltr', mode, disabled }}
        />
      </StyledContainer>
    </>
  );
};
