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

import { DEVTOOLS_Z_INDEX } from '../constants';
import {
  useDialogContext,
  useDialogDispatch,
} from './TranslationDialogContextProvider';

const ScFormControl = styled(FormControl)`
  min-width: 200px;
`;

export const LanguageSelect: React.FC = () => {
  const dispatch = useDialogDispatch();
  const availableLanguages = useDialogContext((c) => c.availableLanguages);
  const selectedLanguages = useDialogContext((c) => c.selectedLanguages);

  const options = availableLanguages
    ? [...availableLanguages].map((lang) => ({
        label: lang.name,
        value: lang.tag,
      }))
    : [];

  const selected = options.filter((o) => selectedLanguages.has(o.value));
  const onChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    const languages = new Set(
      typeof value === 'string' ? value.split(',') : value
    );
    dispatch({
      type: 'ON_SELECTED_LANGUAGES_CHANGE',
      payload: { languages },
    });
  };

  return (
    <>
      {availableLanguages && (
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
