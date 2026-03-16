import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';

import { ScFieldTitle } from '../common/FieldTitle';

type Props = {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  fieldLabel?: string;
  dataCy: string;
  children?: React.ReactNode;
};

export const CheckboxWithField: React.FC<Props> = ({
  checked,
  onChange,
  label,
  fieldLabel,
  dataCy,
  children,
}) => {
  return (
    <Box display="grid">
      <Box justifyContent="start" display="flex" alignItems="center">
        <FormControlLabel
          data-cy={dataCy}
          control={
            <Checkbox checked={checked} onChange={onChange} size="small" />
          }
          label={label}
        />
      </Box>

      {checked && children && (
        <Box display="grid">
          {fieldLabel && (
            <ScFieldTitle style={{ marginTop: 4 }}>{fieldLabel}</ScFieldTitle>
          )}
          {children}
        </Box>
      )}
    </Box>
  );
};
