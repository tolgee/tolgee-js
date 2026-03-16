import React, { useState } from 'react';
import { HelpOutline } from '@mui/icons-material';
import { Box, TextField } from '@mui/material';

import { useDialogActions, useDialogContext } from './dialogContext';
import { Tooltip } from '../common/Tooltip';
import { CheckboxWithField } from './CheckboxWithField';

export const CharLimitCheckbox = () => {
  const maxCharLimit = useDialogContext((c) => c.maxCharLimit);
  const { setMaxCharLimit } = useDialogActions();

  const [enabled, setEnabled] = useState(
    maxCharLimit != null && maxCharLimit > 0
  );

  return (
    <CheckboxWithField
      checked={enabled}
      onChange={() => {
        if (enabled) {
          setEnabled(false);
          setMaxCharLimit(undefined);
        } else {
          setEnabled(true);
        }
      }}
      label={
        <Box display="inline-flex" alignItems="center" gap="4px">
          Character limit
          <Tooltip title="Placeholders and HTML tags are not counted to the character limit">
            <Box component="span" display="inline-flex">
              <HelpOutline style={{ width: 15, height: 15 }} />
            </Box>
          </Tooltip>
        </Box>
      }
      fieldLabel="Maximum"
      dataCy="key-char-limit-checkbox"
    >
      <TextField
        value={maxCharLimit || ''}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') {
            setMaxCharLimit(0);
          } else {
            const val = parseInt(raw, 10);
            if (!isNaN(val)) {
              setMaxCharLimit(Math.max(1, val));
            }
          }
        }}
        type="number"
        size="small"
        inputProps={{ min: 1 }}
        sx={{ maxWidth: 300 }}
        data-cy="key-char-limit-input"
      />
    </CheckboxWithField>
  );
};
