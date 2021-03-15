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


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.white,
   
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const {setLoading,setAccessToken,setRefreshToken,setIDProofVerified} = useContext(GlobalContext);
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }

  const login = async (userCredentials, setSubmitting )=>{
    try{
      setLoading(true)
      const responseData  = await Axios.post(API_URI+'/auth/login',userCredentials);

      console.log(responseData);
      if(responseData.status===200){
        setAccessToken(responseData.data.accessToken)
        setRefreshToken(responseData.data.refreshToken)
        setIDProofVerified(responseData.data.isIDProofVerified)
        if(!responseData.data.isIDProofVerified){
          navigate('/app/profile');
        }else{
          navigate('/app/dashboard');
        }
      }
      setLoading(false)
      // .then((responseData)=>{
      //   console.log(responseData);
       
      // }).catch((err)=>{
      //   setSubmitting(false);
      //   console.log(err);
      // })
      
    }catch(err){
      if (err.response) {
        // client received an error response (5xx, 4xx)
        if(err.response.status===406)
         enqueueSnackbar('Your account is not yet verified, please chek your email and verify',   { variant: "error","anchorOrigin" : alertPosition } );
       if(err.response.status === 404)
         enqueueSnackbar('Email address does not exist with us, Please try again with other email address.',   { variant: "error","anchorOrigin" : alertPosition } );
         if(err.response.status === 401)
         enqueueSnackbar('Username/password not valid',   { variant: "error","anchorOrigin" : alertPosition } );

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
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values, { setSubmitting }) => login(values,  setSubmitting )}
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
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
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
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
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
                    Sign in now
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
                    to="/forgotPassword"
                    variant="h6"
                  >
                     Forgot password?
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

export default LoginView;
