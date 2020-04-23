import { createMuiTheme } from '@material-ui/core/styles';
import {NeueHaasGrotesk, NeueHaasGroteskBold} from '../font/Font';

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

export default theme;