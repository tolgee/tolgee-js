import * as React from 'react';
import { FunctionComponent } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 2147483000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dialogStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '3px',
  boxShadow:
    '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
  position: 'relative',
};

export const Modal: FunctionComponent<DialogProps> = (props) => {
  function onKeyDown(key: string) {
    if (key === 'Escape') {
      props.onClose();
    }
  }

  return (
    <>
      {props.open && (
        <div
          style={backdropStyle}
          onClick={props.onClose}
          onKeyDown={(e) => onKeyDown(e.key)}
        >
          <div
            style={{ ...dialogStyle, ...props.style }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {props.children}
          </div>
        </div>
      )}
    </>
  );
};
