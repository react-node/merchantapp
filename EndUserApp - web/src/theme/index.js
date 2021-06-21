import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: colors.common.white,
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: colors.red[400]
    },
    secondary: {
      main: colors.blueGrey[400]
    },
     // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
   
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.1,
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  shadows,
  typography
});

export default theme;
