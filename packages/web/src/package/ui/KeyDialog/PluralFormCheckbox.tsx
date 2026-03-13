import React from 'react';
import { TextField } from '@mui/material';

import { useDialogActions, useDialogContext } from './dialogContext';
import { CheckboxWithField } from './CheckboxWithField';

export const PluralFormCheckbox = () => {
  const isPlural = useDialogContext((c) => c.isPlural);
  const _pluralArgName = useDialogContext((c) => c._pluralArgName);
  const pluralArgName = useDialogContext((c) => c.pluralArgName);
  const { setIsPlural, setPluralArgName } = useDialogActions();

  return (
    <CheckboxWithField
      checked={isPlural}
      onChange={() => setIsPlural(!isPlural)}
      label="Use plural forms"
      fieldLabel="Variable name"
      dataCy="key-plural-checkbox"
    >
      <TextField
        value={_pluralArgName}
        onChange={(e) => setPluralArgName(e.target.value)}
        placeholder={pluralArgName}
        size="small"
        disabled={!isPlural}
        sx={{ maxWidth: 300 }}
        data-cy="key-plural-variable-name"
      />
    </CheckboxWithField>
  );
};
