import { TolgeeFormat } from '@tginternal/editor';
import { getLanguageDirection } from '@tginternal/editor';
import { RefObject } from 'react';
import { EditorView } from '@codemirror/view';

import { TranslationPlurals } from './TranslationPlurals';
import { EditorWrapper } from './EditorWrapper';
import { Editor, EditorProps } from './Editor';
import { useDialogContext } from '../dialogContext';

type Props = {
  locale: string;
  value: TolgeeFormat;
  onChange?: (value: TolgeeFormat) => void;
  activeVariant?: string;
  onActiveVariantChange?: (variant: string) => void;
  editorProps?: Partial<EditorProps>;
  autofocus?: boolean;
  activeEditorRef?: RefObject<EditorView | null>;
  mode: 'placeholders' | 'syntax' | 'plain';
};

export const PluralEditor = ({
  locale,
  value,
  onChange,
  activeVariant,
  onActiveVariantChange,
  autofocus,
  activeEditorRef,
  editorProps,
  mode,
}: Props) => {
  function handleChange(text: string, variant: string) {
    onChange?.({ ...value, variants: { ...value.variants, [variant]: text } });
  }

  const icuPlaceholders = useDialogContext((c) => c.icuPlaceholders);

  const editorMode = icuPlaceholders ? mode : 'plain';

  return (
    <TranslationPlurals
      value={value}
      locale={locale}
      showEmpty
      activeVariant={activeVariant}
      variantPaddingTop="8px"
      render={({ content, variant, exampleValue }) => {
        const variantOrOther = variant || 'other';
        return (
          <EditorWrapper data-cy="translation-editor" data-cy-variant={variant}>
            <Editor
              mode={editorMode}
              value={content}
              onChange={(value) => handleChange(value, variantOrOther)}
              onFocus={() => onActiveVariantChange?.(variantOrOther)}
              direction={getLanguageDirection(locale)}
              autofocus={variantOrOther === activeVariant ? autofocus : false}
              minHeight={value.parameter ? 'unset' : '50px'}
              locale={locale}
              editorRef={
                variantOrOther === activeVariant ? activeEditorRef : undefined
              }
              examplePluralNum={exampleValue}
              nested={Boolean(variant)}
              {...editorProps}
            />
          </EditorWrapper>
        );
      }}
    />
  );
};
