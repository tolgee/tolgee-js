import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Autocomplete, MenuItem, styled } from '@mui/material';

import { Wrapper } from './Wrapper';
import { CloseButton } from './CloseButton';
import { CustomPopper } from './CustomPopper';
import { useApiQuery } from '../../client/useQueryApi';

const StyledWrapper = styled(Wrapper)`
  & .autocomplete {
    display: flex;
    align-items: center;
    width: 150px;
    overflow: hidden;
  }

  & .MuiAutocomplete-noOptions,
  & .MuiAutocomplete-loading,
  & .MuiAutocomplete-option {
    padding: 6px 16px;
  }
`;

const StyledInput = styled('input')`
  display: flex;
  border: 0px;
  background: transparent;
  padding: 0px 4px;
  outline: 0px;
  min-width: 0px;
  width: 100%;
  font-size: 14;
  flex-shrink: 1;
`;

const StyledOption = styled('span')`
  white-space: nowrap;
  overflow: hidden;
`;

type Props = {
  onClose?: () => void;
  onAdd: (name: string) => void;
  className?: string;
  autoFocus?: boolean;
  existing?: string[];
  placeholder?: string;
};

export const TagInput: React.FC<Props> = ({
  onClose,
  onAdd,
  className,
  autoFocus,
  existing,
  placeholder,
}) => {
  const [value, setValue] = useState('');
  const [search] = useDebounce(value, 500);

  const tags = useApiQuery({
    url: '/v2/projects/tags',
    method: 'get',
    query: {
      search,
    },
    options: {
      cacheTime: 0,
      keepPreviousData: true,
    },
  });

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  const options = (tags.data?._embedded?.tags?.map(({ name }) => name) || [])
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    })
    .map((tag) => ({
      label: tag,
      value: tag,
      isAdd: false,
    }));

  return (
    <StyledWrapper role="input" className={className}>
      <Autocomplete
        className="autocomplete"
        loading={tags.isFetching}
        autoHighlight
        noOptionsText="Nothing found"
        PopperComponent={CustomPopper}
        options={options}
        filterOptions={(options) => {
          const filtered = options.filter((o) =>
            o.value.toLowerCase().startsWith(search.toLowerCase())
          );
          if (search !== '' && !options.find((item) => item.value === search)) {
            filtered.push({
              value: search,
              label: '',
              isAdd: true,
            });
          }
          return filtered.filter((o) => !existing?.includes(o.value));
        }}
        inputValue={value}
        onInputChange={(_, value) => {
          setValue(value);
        }}
        onChange={(_, newValue) => {
          if (typeof newValue !== 'string') {
            onAdd(newValue.value);
          }
        }}
        getOptionLabel={() => ''}
        isOptionEqualToValue={() => true}
        renderOption={(attrs, option) => {
          return (
            <MenuItem {...attrs}>
              <StyledOption data-cy="tag-autocomplete-option">
                {option.isAdd ? `Add "${search}"` : option.label}
              </StyledOption>
            </MenuItem>
          );
        }}
        ListboxProps={{ style: { padding: 0 } }}
        renderInput={(params) => (
          <div className="autocomplete" ref={params.InputProps.ref}>
            <StyledInput
              {...params.inputProps}
              data-cy="tag-autocomplete-input"
              size={0}
              onKeyUp={handleKeyUp}
              autoFocus={autoFocus}
              placeholder={placeholder}
            />
            {onClose && <CloseButton onClick={onClose} />}
          </div>
        )}
      />
    </StyledWrapper>
  );
};
