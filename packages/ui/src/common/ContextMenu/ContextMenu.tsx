import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { RESTRICTED_ASCENDANT_ATTRIBUTE } from '@tolgee/core/lib/Constants/Global';

const CONTEXT_MENU_ID = '_tolgee-context-menu';

export interface ContextMenuProps {
  openEvent: MouseEvent;
  onClose: () => void;
}

export const ContextMenu: FunctionComponent<ContextMenuProps> = (props) => {
  const [width, setWidth] = useState(null);

  const computeLeft = () => {
    if (width === null) {
      return 0;
    }
    if (props.openEvent.clientX + width < document.body.clientWidth) {
      return props.openEvent.clientX;
    }
    return props.openEvent.clientX - width;
  };

  const top = width !== null ? props.openEvent.clientY : -9999;
  const left = computeLeft();
  const ref = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current !== null) {
      setWidth(ref.current.clientWidth);
    }
  }, [ref.current]);

  useEffect(() => {
    document.addEventListener('click', props.onClose);
    return () => {
      document.removeEventListener('click', props.onClose);
    };
  }, [props.onClose]);

  const style: React.CSSProperties = {
    position: 'absolute',
    fontFamily: 'Arial, Helvetica, sans-serif',
    top: `${top}px`,
    left: `${left}px`,
    width: width !== null ? `${width + 1}px` : undefined,
    backgroundColor: 'white',
    borderRadius: '3px',
    boxShadow:
      '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  };

  return (
    <>
      <div
        style={style}
        id={CONTEXT_MENU_ID}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        {...{ [RESTRICTED_ASCENDANT_ATTRIBUTE]: 'true' }}
      >
        {props.children}
      </div>
    </>
  );
};
