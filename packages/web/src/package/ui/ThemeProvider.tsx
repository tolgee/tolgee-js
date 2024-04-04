import React, { useRef } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import {
  createTheme,
  css,
  ThemeProvider as MuiThemeProvider,
  GlobalStyles,
} from '@mui/material';

import { DEVTOOLS_Z_INDEX } from '../constants';
import { getRootElement } from './getRootElement';

let theme = createTheme({
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    htmlFontSize: 0,
  },
  palette: {
    primary: {
      main: '#EC407A',
    },
    secondary: {
      main: '#2B5582',
    },
    text: {
      secondary: '#808080',
    },
    background: {
      default: 'rgb(255, 255, 255)',
    },
  },
  zIndex: {
    modal: DEVTOOLS_Z_INDEX,
  },
});

theme = createTheme(theme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 12,
          boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.25)',
          borderRadius: '11px',
          color: 'black',
          backgroundColor: 'white',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          width: '19px',
          height: '19px',
        },
      },
    },
  },
});

const globalStyles = css`
  :host > * {
    all: initial;
  }
`;

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const cache = useRef(
    createCache({
      key: 'tolgee-dev-tools',
      prepend: true,
      container: getRootElement(),
    })
  );

  return (
    <CacheProvider value={cache.current!}>
      <GlobalStyles styles={globalStyles} />
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </CacheProvider>
  );
}
