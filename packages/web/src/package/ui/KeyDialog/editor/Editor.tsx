import React, { RefObject, useEffect, useMemo, useRef } from 'react';
import { minimalSetup } from 'codemirror';
import { Compartment, EditorState, Prec } from '@codemirror/state';
import { ViewUpdate, EditorView, keymap, KeyBinding } from '@codemirror/view';
import { Direction, styled, useTheme } from '@mui/material';
import {
  tolgeeSyntax,
  PlaceholderPlugin,
  TolgeeHighlight,
  generatePlaceholdersStyle,
} from '@tginternal/editor';

import { editorTheme } from './editorTheme';

const editorSyntaxColors = {
  function: '#007300',
  other: '#002bff',
  main: '#2C3C52',
};

const StyledEditor = styled('div')`
  font-size: 14px;
  display: grid;

  & .cm-editor {
    outline: none !important;
  }

  & .cm-line {
    font-size: 15px !important;
    font-family: ${({ theme }) => theme.typography.fontFamily} !important;
    padding: 0px 1px !important;
  }

  & .cm-content {
    padding: 0px !important;
  }

  & .cm-cursor {
    border-color: ${({ theme }) => theme.palette.text.primary} !important;
  }
`;

export type EditorProps = {
  value: string;
  onChange?: (val: string) => void;
  background?: string;
  mode: 'placeholders' | 'syntax' | 'plain';
  direction?: Direction;
  autofocus?: boolean;
  minHeight?: number | string;
  onBlur?: () => void;
  onFocus?: () => void;
  shortcuts?: KeyBinding[];
  autoScrollIntoView?: boolean;
  locale?: string;
  editorRef?: React.RefObject<EditorView | null>;
  examplePluralNum?: number;
  nested?: boolean;
  disabled?: boolean;
};

function useRefGroup<T>(value: T): RefObject<T> {
  const refObject = useRef(value);
  refObject.current = value;
  return refObject;
}

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  mode,
  direction,
  autofocus,
  shortcuts,
  minHeight,
  locale,
  editorRef,
  examplePluralNum,
  nested,
  disabled,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView>();
  const placeholders = useRef<Compartment>(new Compartment());
  const isolates = useRef<Compartment>(new Compartment());
  const disabledCompartment = useRef<Compartment>(new Compartment());
  const keyBindings = useRef(shortcuts);
  const theme = useTheme();
  const callbacksRef = useRefGroup({
    onChange,
    onFocus,
    onBlur,
  });
  const languageCompartment = useRef<Compartment>(new Compartment());

  const StyledEditorWrapper = useMemo(() => {
    return generatePlaceholdersStyle({
      styled,
      colors: editorTheme,
      component: StyledEditor,
    });
  }, []);

  keyBindings.current = shortcuts;

  useEffect(() => {
    const shortcutsUptoDate = shortcuts?.map((value, i) => {
      return {
        ...value,
        run: (val: EditorView) => keyBindings.current?.[i].run?.(val) ?? false,
      };
    });

    const instance = new EditorView({
      parent: ref.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          minimalSetup,
          Prec.highest(keymap.of(shortcutsUptoDate ?? [])),
          EditorView.lineWrapping,
          EditorView.updateListener.of((v: ViewUpdate) => {
            if (v.focusChanged) {
              if (v.view.hasFocus) {
                callbacksRef.current?.onFocus?.();
              } else {
                callbacksRef.current?.onBlur?.();
              }
            }
            if (v.docChanged) {
              callbacksRef.current?.onChange?.(v.state.doc.toString());
            }
          }),
          EditorView.contentAttributes.of({
            spellcheck: 'true',
            lang: locale || '',
          }),
          TolgeeHighlight(editorSyntaxColors),
          languageCompartment.current.of([]),
          placeholders.current.of([]),
          isolates.current.of([]),
          disabledCompartment.current.of([]),
        ],
      }),
    });

    if (autofocus) {
      instance.focus();
    }

    editor.current = instance;
  }, [theme.palette.mode]);

  useEffect(() => {
    const placholderPlugins =
      mode === 'placeholders'
        ? [
            PlaceholderPlugin({
              examplePluralNum,
              nested: Boolean(nested),
              tooltips: true,
            }),
          ]
        : [];
    const syntaxPlugins =
      mode === 'plain' ? [] : [tolgeeSyntax(Boolean(nested))];
    editor.current?.dispatch({
      selection: editor.current.state.selection,
      effects: [
        placeholders.current?.reconfigure(placholderPlugins),
        languageCompartment.current.reconfigure(syntaxPlugins),
      ],
    });
  }, [mode, nested, examplePluralNum]);

  useEffect(() => {
    const state = editor.current?.state;
    const editorValue = state?.doc.toString();
    if (state && editorValue !== value) {
      const transaction = state.update({
        changes: { from: 0, to: state.doc.length, insert: value || '' },
      });
      editor.current?.update([transaction]);
    }
  }, [value]);

  useEffect(() => {
    // set cursor to the end of document
    const length = editor.current!.state.doc.length;
    editor.current!.dispatch({ selection: { anchor: length } });

    return () => {
      editor.current!.destroy();
    };
  }, []);

  useEffect(() => {
    editor.current?.dispatch({
      effects: disabledCompartment.current.reconfigure(
        EditorState.readOnly.of(Boolean(disabled))
      ),
    });
  }, [disabled]);

  useEffect(() => {
    if (editorRef) {
      // @ts-ignore
      editorRef.current = editor.current;
    }
  });

  return (
    <StyledEditorWrapper
      data-cy="global-editor"
      ref={ref}
      disabled={disabled}
      dir={direction}
      style={{
        minHeight,
        direction,
      }}
    />
  );
};
