import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useContext } from 'react';
import { useRoutes } from 'react-router-dom';
import { makeStyles, ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import { SnackbarProvider } from 'notistack';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import Loading from "src/components/Loading"
import { GlobalContext } from "../src/context/GlobalState";

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
   const {getAccessToken,getIDProofVerified,getUserType} = useContext(GlobalContext);
   const accessToken =  getAccessToken()
   const isIDProofVerified = getIDProofVerified() 
   const userType = getUserType() 
   console.log("accesstoken--------------------",accessToken)
   //const accessToken = window.sessionStorage.getItem('token')
   const routing = useRoutes(routes(accessToken,isIDProofVerified,userType));

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
      <Loading  />
      {routing}
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
