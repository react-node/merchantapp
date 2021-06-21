import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import { SnackbarProvider } from 'notistack';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
  snack: {
    top:65,
    position:'absolute'
  },
  snackbarContainer:{
    height:0
  }
}));
const App = () => {
  const classes = useStyles();
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider 
       maxSnack={3}
        classes={{ 
          root: classes.snack,
          containerRoot: classes.snackbarContainer
        }}
        >
      <GlobalStyles />
      {routing}
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
