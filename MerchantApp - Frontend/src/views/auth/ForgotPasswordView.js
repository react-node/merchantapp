import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import {API_URI} from '../../utils/config';
import { GlobalContext } from "../../context/GlobalState";
import {  useSnackbar } from 'notistack';
import Services from 'src/services/Services';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.white,
   
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ForgotPasswordView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const {setLoading,setAccessToken} = useContext(GlobalContext);
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top",marginTop:"75px" }

  const forgotPassword = async (userCredentials, setSubmitting )=>{
    try{
      setLoading(true)
      const responseData  = await Services.forgotPassword(userCredentials);

      console.log(responseData);
      if(responseData.status===200){
       enqueueSnackbar('Sent email to your account. please check and update password',   { variant: "success","anchorOrigin" : alertPosition } );
        
      }
      setLoading(false)
     
    }catch(err){
      if (err.response) {
        // client received an error response (5xx, 4xx)
       if(err.response.status === 404)
        enqueueSnackbar('Email address does not exist with us, Please try again with other email address.',   { variant: "error","anchorOrigin" : alertPosition } );

        console.log("error in api call")
      } else if (err.request) {
        // client never received a response, or request never left
        console.log("request failed and no response ")
      } else {
        // anything else
        console.log("request failed due to slow network")

      }
      setSubmitting(false);
      setLoading(false)
      //   console.log(err);
    }

   
  }
  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
            //  password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            //  password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values, { setSubmitting }) => forgotPassword(values,  setSubmitting )}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Forgot Password
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Enter your email address and we'll send you a link to reset your password
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={3}
                >
              </Grid>
                <br/>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                </Box>
                <Grid container>
                  <Grid item md={6} xs={8}>
                <Typography
               
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
                </Grid>
                <Grid item  md={6} xs={4}>
                <Typography
                  align="right"
                  color="textSecondary"
                  variant="body1"
                >
                  <Link
                    component={RouterLink}
                    to="/"
                    variant="h6"
                  >
                     Login
                  </Link>
                </Typography>
                </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default ForgotPasswordView;
