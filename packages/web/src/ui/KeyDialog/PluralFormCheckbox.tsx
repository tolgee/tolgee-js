import React, { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import { useDialogActions, useDialogContext } from './dialogContext';
import { ScFieldTitle } from '../common/FieldTitle';

export const PluralFormCheckbox = () => {
  const isPlural = useDialogContext((c) => c.isPlural);
  const pluralArgName = useDialogContext((c) => c._pluralArgName);
  const { setIsPlural, setPluralArgName } = useDialogActions();
  const [expanded, setExpanded] = useState(false);

  return (
    <Box display="grid" mt={2}>
      <Box justifyContent="start" display="flex" alignItems="center">
        <FormControlLabel
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
          <ScFieldTitle sx={{ mt: 0.5 }}>Variable name</ScFieldTitle>
          <TextField
            value={pluralArgName}
            onChange={(e) => setPluralArgName(e.target.value)}
            size="small"
            disabled={!isPlural}
            sx={{ maxWidth: 300 }}
          />
        </Box>
      )}
    </Box>
  );
};
