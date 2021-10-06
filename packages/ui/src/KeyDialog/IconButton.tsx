import * as React from 'react';
import { FC } from 'react';
import { useWithStyles } from '../common/styles/useWithStyles';

export const IconButton: FC<
  {
    onClick: () => any;
  } & React.ButtonHTMLAttributes<any>
> = (props) => {
  useWithStyles(`
  .tolgee-icon-button:hover {
    background-color: rgba(43, 85, 130, 0.04) !important;
  }
`);

  return (
    <button
      className="tolgee-icon-button"
      {...props}
      style={{
        ...props.style,
        backgroundColor: 'white',
        border: 0,
        cursor: 'pointer',
        borderRadius: '50%',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '5px',
        lineHeight: '8px',
        margin: '-5px',
      }}
    >
      {props.children}
    </button>
  );
};
