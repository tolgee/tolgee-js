import * as React from 'react';
import { FunctionComponent } from 'react';
import { CircularLoading } from './common/CircularLoading';
import { MultiSelect } from './common/multiSelect/MultiSelect';
import { useTranslationDialogContext } from './translationDialog/useTranslationDialogContext';

export const LanguageSelect: FunctionComponent = () => {
  const context = useTranslationDialogContext();

  if (context.availableLanguages === undefined) {
    return <CircularLoading />;
  }

  const options = [...context.availableLanguages].map((name) => ({
    label: name,
    value: name,
  }));
  const selected = options.filter((o) =>
    context.selectedLanguages.has(o.value)
  );
  const onChange = (values: { value: string; label: string }[]) => {
    context.onSelectedLanguagesChange(new Set(values.map((o) => o.value)));
  };

  return (
    <>
      {context.availableLanguages && (
        <MultiSelect
          value={selected}
          options={options}
          onChange={(_, value) => onChange(value)}
          label={'Choose languages'}
          renderValues={(v) => v.map((o) => o.value).join(', ')}
          renderOption={(o) => o.label}
        />
      )}
    </>
  );
};
