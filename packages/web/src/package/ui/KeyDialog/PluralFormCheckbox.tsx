import React from 'react';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';

import { useDialogActions, useDialogContext } from './dialogContext';
import { ScFieldTitle } from '../common/FieldTitle';

export const PluralFormCheckbox = () => {
  const isPlural = useDialogContext((c) => c.isPlural);
  const _pluralArgName = useDialogContext((c) => c._pluralArgName);
  const pluralArgName = useDialogContext((c) => c.pluralArgName);
  const { setIsPlural, setPluralArgName } = useDialogActions();

  return (
    <Box display="grid">
      <Box justifyContent="start" display="flex" alignItems="center">
        <FormControlLabel
          data-cy="key-plural-checkbox"
          control={
            <Checkbox
              checked={isPlural}
              onChange={() => setIsPlural(!isPlural)}
              size="small"
            />
          }
          label="Use plural forms"
        />
      </Box>

      {isPlural && (
        <Box display="grid">
          <ScFieldTitle style={{ marginTop: 4 }}>Variable name</ScFieldTitle>
          <TextField
            value={_pluralArgName}
            onChange={(e) => setPluralArgName(e.target.value)}
            placeholder={pluralArgName}
            size="small"
            disabled={!isPlural}
            sx={{ maxWidth: 300 }}
            data-cy="key-plural-variable-name"
          />
        </Box>
      )}
    </Box>
  );
};
