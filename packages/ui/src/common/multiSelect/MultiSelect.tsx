import React = require('react');
import { ReactNode, SyntheticEvent, useRef, useState } from 'react';
import { MultiSelectMenu } from './MultiSelectMenu';

const rootStyle: React.CSSProperties = {
  margin: '10px 0 0 0',
  padding: '5px',
  border: '1px solid #ccc',
  width: '100%',
  borderRadius: '5px',
  fontStyle: 'inherit',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  display: 'block',
  cursor: 'pointer',
};

export const MultiSelect = <Option,>(props: {
  options: Option[];
  label: string;
  value: Option[];
  renderOption: (o: Option) => ReactNode;
  onChange: (e: SyntheticEvent, value: Option[]) => void;
  renderValues: (options: Option[]) => ReactNode;
  children?: undefined;
}) => {
  const [open, setOpen] = useState(false);
  const anchorElRef = useRef(null);

  return (
    <div>
      <div
        style={{ ...rootStyle }}
        onClick={() => setOpen(true)}
        ref={anchorElRef}
      >
        {props.value && props.value.length > 0 && props.renderValues
          ? props.renderValues(props.value)
          : props.label}
      </div>
      <div style={{ position: 'relative' }}>
        <MultiSelectMenu
          anchorEl={open ? anchorElRef.current : undefined}
          onClose={() => setOpen(false)}
          {...props}
        />
      </div>
    </div>
  );
};
