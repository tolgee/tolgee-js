import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { TolgeeFormat } from '@tginternal/editor';

import { components } from '../client/apiSchema.generated';
import { TRANSLATION_STATES } from './State/translationStates';
import { DEVTOOLS_Z_INDEX } from '../../constants';
import { PluralEditor } from './editor/PluralEditor';
import { ControlsEditorSmall } from './editor/ControlsEditorSmall';
import { ScFieldTitle } from '../common/FieldTitle';
import { useDialogContext } from './dialogContext';

type State = components['schemas']['TranslationModel']['state'];
type LanguageModel = components['schemas']['LanguageModel'];

const StyledContainer = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  position: relative;

  &.disabled {
    opacity: 0.5;
  }

  &.disabled .cm-cursor {
    display: none !important;
  }

  &.notPlural {
    grid-template-columns: 1fr;
  }
`;

const StyledStateIndicator = styled('div')`
  margin-top: 4px;
  width: 5px;

  &.notPlural {
    position: absolute;
    top: 1px;
    left: 1px;
    bottom: 1px;
    border-radius: 3px 0px 0px 3px;
  }
`;

type Props = {
  disabled?: boolean;
  language: LanguageModel | undefined;
  value: TolgeeFormat | undefined;
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
  const parameter = useDialogContext((c) => c.pluralArgName);
  const icuPlaceholders = useDialogContext((c) => c.icuPlaceholders);
  const notPlural = !parameter;
  const [mode, setMode] = useState<'placeholders' | 'syntax'>('placeholders');
  return (
    <>
      <ScFieldTitle>
        <div>{language?.name || language?.tag}</div>
        {!disabled && (
          <ControlsEditorSmall
            state={state}
            onStateChange={(value) => onStateChange(value)}
            language={language?.tag}
            stateChangeEnabled={stateChangePermitted}
            mode={mode}
            onModeToggle={
              icuPlaceholders
                ? () => setMode(mode === 'syntax' ? 'placeholders' : 'syntax')
                : undefined
            }
          />
        )}
      </ScFieldTitle>
      <StyledContainer className={clsx({ disabled, notPlural })}>
        <Tooltip
          disableInteractive
          title={TRANSLATION_STATES[fallbackedState]?.name}
          PopperProps={{
            disablePortal: true,
            style: { zIndex: DEVTOOLS_Z_INDEX },
          }}
        >
          <StyledStateIndicator
            className={clsx({ notPlural })}
            style={{
              background: TRANSLATION_STATES[fallbackedState]?.color,
            }}
            onClick={() => {
              textFieldRef.current?.focus();
            }}
          />
        </Tooltip>
        <PluralEditor
          mode={mode}
          value={value ? { ...value, parameter } : { variants: { other: '' } }}
          onChange={onChange}
          locale={language!.tag}
          editorProps={{ direction: 'ltr', disabled }}
        />
      </StyledContainer>
    </>
  );
};
