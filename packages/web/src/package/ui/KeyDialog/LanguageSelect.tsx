import React from 'react';
import {
  Select,
  selectClasses,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControl,
  styled,
} from '@mui/material';

import { DEVTOOLS_Z_INDEX } from '../../constants';
import { useDialogContext, useDialogActions } from './dialogContext';

const StyledFormControl = styled(FormControl)`
  min-width: 200px;
`;

const StyledSelect = styled(Select<string[]>)`
  & .${selectClasses.icon} {
    width: 24px;
    height: 24px;
    top: calc(50% - 12px);
  }
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

  const selected = options.filter((o) => selectedLanguages.includes(o.value!));
  const onChange = (value: string | string[]) => {
    const languages = typeof value === 'string' ? value.split(',') : value;
    onSelectedLanguagesChange(languages);
  };

  return (
    <>
      {availableLanguages && (
        <StyledFormControl
          variant="outlined"
          size="small"
          style={{ maxWidth: 250 }}
        >
          <StyledSelect
            multiple
            value={selected.map((o) => o.value)}
            onChange={(e) => onChange(e.target.value as string | string[])}
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
          </StyledSelect>
        </StyledFormControl>
      )}
    </>
  );
};
