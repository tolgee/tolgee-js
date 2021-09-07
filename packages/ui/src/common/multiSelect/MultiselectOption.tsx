import { ReactNode, SyntheticEvent } from 'react';
import { Checkbox, CheckboxChecked } from '../icons';
import { useWithStyles } from '../styles/useWithStyles';
import * as React from 'react';

export const MultiselectOption = <Option,>(props: {
  option: Option;
  renderOption: (o: Option) => ReactNode;
  selected: boolean;
  onToggle: (e: SyntheticEvent) => void;
}) => {
  useWithStyles(`
  .tolgee-multiselect-item:hover{
    background-color: rgba(0, 0, 0, 0.04);
  }
  .tolgee-multiselect-checkbox:hover{
    background-color: rgba(43, 85, 130, 0.04);
  }
  `);
  return (
    <div
      className="tolgee-multiselect-item"
      onClick={props.onToggle}
      style={{
        backgroundColor: props.selected ? 'rgba(0, 0, 0, 0.08)' : undefined,
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
      }}
    >
      <div
        className={'tolgee-multiselect-checkbox'}
        style={{
          flex: '0 0 auto',
          color: 'rgba(0, 0, 0, 0.54)',
          padding: '9px',
          overflow: 'visible',
          textAlign: 'center',
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          borderRadius: '50%',
          lineHeight: '10px',
        }}
      >
        {!props.selected ? (
          <Checkbox
            style={{
              fontSize: '1.25rem',
              color: '#808080',
            }}
          />
        ) : (
          <CheckboxChecked
            style={{
              fontSize: '1.25rem',
              color: '#2B5582',
            }}
          />
        )}
      </div>
      <div>{props.renderOption(props.option)}</div>
    </div>
  );
};
