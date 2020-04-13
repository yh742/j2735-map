import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import App from './App';
import {NeueHaasGrotesk, NeueHaasGroteskBold} from './font/Font'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import { SettingContextProvider } from "./Components/Store";

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Neue Haas Grotesk'].join(','),
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [NeueHaasGrotesk, NeueHaasGroteskBold],
      },
    },
  },
  palette: {
    primary: {
      main: "#000000",
    }, 
    secondary: {
      main: "#CD040B",
    }
  },
});

const RouteAwareApp = withRouter(App);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SettingContextProvider>
          <RouteAwareApp />
        </SettingContextProvider>
      </MuiThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
