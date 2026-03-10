import React, { useState } from 'react';
import { ExpandLess, ExpandMore, HelpOutline } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
} from '@mui/material';

import { useDialogActions, useDialogContext } from './dialogContext';
import { Tooltip } from '../common/Tooltip';
import { ScFieldTitle } from '../common/FieldTitle';

export const CharLimitInput = () => {
  const maxCharLimit = useDialogContext((c) => c.maxCharLimit);
  const { setMaxCharLimit } = useDialogActions();

  const [enabled, setEnabled] = useState(
    maxCharLimit != null && maxCharLimit > 0
  );
  const [_expanded, setExpanded] = useState(enabled);
  const expanded = _expanded && enabled;

  return (
    <Box display="grid">
      <Box justifyContent="start" display="flex" alignItems="center">
        <FormControlLabel
          data-cy="key-char-limit-checkbox"
          control={
            <Checkbox
              checked={enabled}
              onChange={() => {
                if (enabled) {
                  setEnabled(false);
                  setMaxCharLimit(undefined);
                } else {
                  setEnabled(true);
                  setExpanded(true);
                }
              }}
              size="small"
            />
          }
          label={
            <Box display="inline-flex" alignItems="center" gap="4px">
              Limit of characters
              <Tooltip title="Placeholders, HTML tags, and # are not counted toward the character limit">
                <Box component="span" display="inline-flex">
                  <HelpOutline style={{ width: 15, height: 15 }} />
                </Box>
              </Tooltip>
            </Box>
          }
        />
        <IconButton
          size="small"
          onClick={() => setExpanded((val) => !val)}
          disabled={!enabled}
          data-cy="key-char-limit-expand"
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
          <ScFieldTitle style={{ marginTop: 4 }}>
            Max characters (placeholders excluded)
          </ScFieldTitle>
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
        </Box>
      )}
    </Box>
  );
};
