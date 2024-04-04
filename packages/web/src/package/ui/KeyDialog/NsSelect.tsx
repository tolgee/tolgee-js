import React from 'react';
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  ListItemText,
} from '@mui/material';

import { DEVTOOLS_Z_INDEX } from '../../constants';
import { ScFieldTitle } from '../../ui/common/FieldTitle';

const getNsName = (ns: string) => {
  if (!ns) {
    return '<default>';
  }
  return ns;
};

type Props = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export const NsSelect: React.FC<Props> = ({ onChange, options, value }) => {
  const namespaces = options;
  const namespaceOne = namespaces.length === 1;
  const namespaceEmpty = namespaceOne && namespaces[0] === '';

  return (
    <>
      {!namespaceEmpty && (
        <>
          <ScFieldTitle>Namespace</ScFieldTitle>
          {namespaceOne ? (
            getNsName(namespaces[0])
          ) : (
            <FormControl
              variant="outlined"
              size="small"
              style={{ maxWidth: 250 }}
            >
              <Select
                displayEmpty
                value={value}
                onChange={(e) => onChange(e.target.value)}
                input={<OutlinedInput />}
                renderValue={(value) => getNsName(value)}
                MenuProps={{
                  style: { zIndex: DEVTOOLS_Z_INDEX },
                  disablePortal: true,
                }}
              >
                {namespaces.map((ns) => (
                  <MenuItem key={ns} value={ns} dense>
                    <ListItemText>{getNsName(ns)}</ListItemText>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </>
      )}
    </>
  );
};
