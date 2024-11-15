import React, { useEffect, useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
} from '@mui/material';

import { useDialogActions, useDialogContext } from './dialogContext';
import { ScFieldTitle } from '../common/FieldTitle';

function isParameterDefault(value: string | undefined) {
  return value === undefined || value === 'value';
}

export const PluralFormCheckbox = () => {
  const isPlural = useDialogContext((c) => c.isPlural);
  const _pluralArgName = useDialogContext((c) => c._pluralArgName);
  const pluralArgName = useDialogContext((c) => c.pluralArgName);
  const { setIsPlural, setPluralArgName } = useDialogActions();
  const [_expanded, setExpanded] = useState(
    !isParameterDefault(_pluralArgName)
  );

  useEffect(() => {
    if (isPlural && !isParameterDefault(_pluralArgName)) {
      setExpanded(true);
    }
  }, [_pluralArgName]);
  const expanded = _expanded && isPlural;

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
        <IconButton
          size="small"
          onClick={() => setExpanded((val) => !val)}
          disabled={!isPlural}
          data-cy="key-plural-checkbox-expand"
        >
          {expanded ? (
            <ExpandLess fontSize="small" />
          ) : (
            <ExpandMore fontSize="small" />
          )}
        </IconButton>
      </Box>

      {expanded && (
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
