import * as React from 'react';
import { SVGProps } from 'react';

const style: React.CSSProperties = {
  fill: 'currentColor',
  width: '1em',
  height: '1em',
  display: 'inline-block',
  fontSize: '1.5rem',
  transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  flexShrink: 0,
  userSelect: 'none',
};

export const Checkbox = (props: SVGProps<any>) => (
  <svg
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
    style={{ ...style, ...props.style }}
  >
    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
  </svg>
);

export const CheckboxChecked = (props: SVGProps<any>) => (
  <svg
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
    style={{ ...style, ...props.style }}
  >
    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export const OpenInNew = (props: SVGProps<any>) => (
  <svg
    className="MuiSvgIcon-root jss248"
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
    style={{ ...style, ...props.style }}
  >
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
  </svg>
);
