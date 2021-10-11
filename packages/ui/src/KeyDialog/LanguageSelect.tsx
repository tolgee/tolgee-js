import React from 'react';
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent,
  FormControl,
  styled,
} from '@mui/material';

import { useTranslationDialogContext } from './useTranslationDialogContext';
import { DEVTOOLS_Z_INDEX } from '../constants';

const ScFormControl = styled(FormControl)`
  min-width: 200px;
`;

export const LanguageSelect: React.FC = () => {
  const context = useTranslationDialogContext();

  const options = context.availableLanguages
    ? [...context.availableLanguages].map((lang) => ({
        label: lang.name,
        value: lang.tag,
      }))
    : [];

  const selected = options.filter((o) =>
    context.selectedLanguages.has(o.value)
  );
  const onChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    context.onSelectedLanguagesChange(
      new Set(typeof value === 'string' ? value.split(',') : value)
    );
  };

  return (
    <>
      {context.availableLanguages && (
        <ScFormControl variant="outlined" size="small">
          <Select
            multiple
            value={selected.map((o) => o.value)}
            onChange={(value) => onChange(value)}
            input={<OutlinedInput />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              style: { zIndex: DEVTOOLS_Z_INDEX },
              disablePortal: true,
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value} dense>
                <Checkbox
                  size="small"
                  checked={Boolean(
                    selected.find((o) => o.value === option.value)
                  )}
                />
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </ScFormControl>
      )}
    </>
  );
};
