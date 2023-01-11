import React from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

import { DEVTOOLS_Z_INDEX } from '../../constants';
import { useDialogContext, useDialogActions } from './dialogContext';

const ScFormControl = styled(FormControl)`
  min-width: 200px;
`;

export const LanguageSelect: React.FC = () => {
  const { onSelectedLanguagesChange } = useDialogActions();
  const availableLanguages = useDialogContext((c) => c.availableLanguages);
  const selectedLanguages = useDialogContext((c) => c.selectedLanguages);

  const options = availableLanguages
    ? [...availableLanguages].map((lang) => ({
        label: lang.name,
        value: lang.tag,
      }))
    : [];

  const selected = options.filter((o) => selectedLanguages.includes(o.value));
  const onChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    const languages = typeof value === 'string' ? value.split(',') : value;
    onSelectedLanguagesChange(languages);
  };

  return (
    <>
      {availableLanguages && (
        <ScFormControl
          variant="outlined"
          size="small"
          style={{ maxWidth: 250 }}
        >
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
