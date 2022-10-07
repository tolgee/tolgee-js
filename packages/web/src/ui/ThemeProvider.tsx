import React, { useRef } from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { DEVTOOLS_ID, DEVTOOLS_Z_INDEX } from '../constants';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

let theme = createTheme({
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  palette: {
    primary: {
      main: '#822B55',
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
  },
});

export const ThemeProvider: React.FC = ({ children }) => {
  const cache = useRef(
    createCache({
      key: 'css',
      prepend: true,
      container: document.getElementById(DEVTOOLS_ID)?.shadowRoot as Node,
    })
  );

  return (
    <CacheProvider value={cache.current!}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </CacheProvider>
  );
};
