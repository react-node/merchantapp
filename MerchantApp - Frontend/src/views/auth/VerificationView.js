import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
 
  Container,
 
  Grid,
 
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import { GlobalContext } from "../../context/GlobalState";
import Services from '../../services/Services';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.white,
    
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const VerificationView = () => {
  const {setLoading} = useContext(GlobalContext);
  const [isValid,setIsValid] = useState(false)
  const [errorMessage,setErrorMessage] = useState('')

  const classes = useStyles();
  //Then inside your component
  const { token,userid } = useParams();
  const verifyUser = async () => {
    console.log(token, userid)
    try{
        setLoading(true)
        const response = await Services.userVerification( token,userid )
        console.log(response)
        if(response.data.status ===5001){
            setIsValid(true)
            setErrorMessage("Your account activated successfully. Please use your credentials to ")
        }else if(response.data.status ===5002){
            setErrorMessage("Your account is already activated. Please use your credentials to ")
            setIsValid(true)
        }
        
        setLoading(false)
    }catch(err){
        setLoading(false)
        setIsValid(false)
        setErrorMessage("Sorry, You are not registerd user. Please try again with correct link. ")
    }
 
   
  
  }
  useEffect(()=>{
    verifyUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Page
      className={classes.root}
      title="Register"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
            {isValid ? (<Grid item>
            {errorMessage}
                <Link
                    component="button"
                    variant="body2"
                    to ="/"
                  
                >
                     login
                </Link>.
            </Grid>):(
               <Grid item>
                {errorMessage}
               </Grid>
            )  
            }
        </Container>
      </Box>
    </Page>
  );
};

export default VerificationView;
