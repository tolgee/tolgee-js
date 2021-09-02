import { useWithStyles } from './styles/useWithStyles';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { FONT_FAMILY } from './constants';

const css = `
.tolgee-button{
    border: 1px solid rgba(0, 0, 0, 0.23);
    color: rgba(0, 0, 0, 0.87);
    padding: 6px 16px;
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    font-family: ${FONT_FAMILY};
    font-weight: 500;
    line-height: 1.75;
    border-radius: 4px;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    background-color: transparent;
    outline: 0;
    cursor: pointer;
}

.tolgee-button:disabled, .tolgee-button:disabled:hover{
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.23);
    color: rgba(0, 0, 0, 0.87);
}

.tolgee-button:hover{
    background-color: rgba(0, 0, 0, 0.04);
}

.tolgee-button-primary{
    color: #822B55;
    border-color: rgba(130, 43, 85, 0.5);
}
.tolgee-button-primary:hover{
    border: 1px solid #822B55;
    background-color: rgba(130, 43, 85, 0.04);
}

.tolgee-button-secondary {
    color: rgb(220, 0, 78);
    border: 1px solid rgba(220, 0, 78, 0.5);
}

.tolgee-button-secondary:hover {
    color: rgb(220, 0, 78);
    border: 1px solid rgba(220, 0, 78, 0.5);
}`;

type Variant = 'primary' | 'secondary' | 'default';
type ButtonProps = React.ComponentProps<'button'> & {
  color?: Variant;
};

export const Button: FunctionComponent<ButtonProps> = (props) => {
  useWithStyles(css);

  const variantClass =
    props.color || props.color === 'default'
      ? `tolgee-button-${props.color}`
      : '';
  return <button {...props} className={`tolgee-button ${variantClass}`} />;
};
