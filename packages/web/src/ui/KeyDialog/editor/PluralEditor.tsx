import React from 'react';
import { EditorView } from 'codemirror';
import { TranslationPlurals } from './TranslationPlurals';
import { EditorWrapper } from './EditorWrapper';
import { Editor, EditorProps } from './Editor';
import { TolgeeFormat } from '@tginternal/editor';
import { getLanguageDirection } from '@tginternal/editor';
import { RefObject } from 'react';

type Props = {
  locale: string;
  value: TolgeeFormat;
  onChange?: (value: TolgeeFormat) => void;
  activeVariant?: Intl.LDMLPluralRule;
  onActiveVariantChange?: (variant: Intl.LDMLPluralRule) => void;
  editorProps?: Partial<EditorProps>;
  autofocus?: boolean;
  activeEditorRef?: RefObject<EditorView | null>;
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
}: Props) => {
  function handleChange(text: string, variant: Intl.LDMLPluralRule) {
    onChange?.({ ...value, variants: { ...value.variants, [variant]: text } });
  }

  return (
    <TranslationPlurals
      value={value}
      locale={locale}
      showEmpty
      activeVariant={activeVariant}
      variantPaddingTop="8px"
      render={({ content, variant, exampleValue }) => {
        return (
          <EditorWrapper>
            <Editor
              mode="placeholders"
              value={content}
              onChange={(value) => handleChange(value, variant ?? 'other')}
              onFocus={() => onActiveVariantChange?.(variant ?? 'other')}
              direction={getLanguageDirection(locale)}
              autofocus={variant === activeVariant ? autofocus : false}
              minHeight={value.parameter ? 'unset' : '50px'}
              locale={locale}
              editorRef={
                variant === activeVariant ? activeEditorRef : undefined
              }
              examplePluralNum={exampleValue}
              {...editorProps}
            />
          </EditorWrapper>
        );
      }}
    />
  );
};
