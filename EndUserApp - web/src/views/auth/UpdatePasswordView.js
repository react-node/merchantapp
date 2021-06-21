import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
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
import {  useSnackbar } from 'notistack';
import * as config from '../../utils/config'
import useServiceCalls from '../../hooks/useServiceCalls'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.white,
   
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const UpdatePasswordView = () => {
  const classes = useStyles();
  const { token,email } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const {post} = useServiceCalls()

  const updatePassword = async (formData, setSubmitting )=>{
    try{
      const requestData = {...formData,token,email}
      const url = `${config.API_URI}${config.CUST_UPDATE_PASSWORD}`
      await post(url, requestData,false)
      //if(result.data.status ===200)
      enqueueSnackbar('Updated successfully, Please login with your new credentials',   { variant: "success","anchorOrigin" : alertPosition } );
      navigate('/')
    }catch(err){
      if (err.response) {
        // client received an error response (5xx, 4xx)
        if(err.response.status===406)
         enqueueSnackbar('Your account is not yet verified, please chek your email and verify',   { variant: "error","anchorOrigin" : alertPosition } );
        if(err.response.status === 404)
         enqueueSnackbar('Email address does not exist with us / Token expired.',   { variant: "error","anchorOrigin" : alertPosition } );
        else
        enqueueSnackbar('Something went wrong, Please try again later.',   { variant: "error","anchorOrigin" : alertPosition } );

       console.log("error in api call")
      } else if (err.request) {
        // client never received a response, or request never left
        console.log("request failed and no response ")
      } else {
        // anything else
        console.log("request failed due to slow network")

      }
      setSubmitting(false);
      //   console.log(err);
    }

   
  }
 
  return (
    <Page
      className={classes.root}
      title="Reset Password"
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
             // email: '',
             confirmPassword: '',
             password: ''
            }}
            validationSchema={Yup.object().shape({
              //confirmPassword: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required'),
              confirmPassword: Yup.string().max(255).required('Confirm password is required')
              .test("password-confirm-password-same",
              "Password and confirm password should be same",
              function(value){
                return this.parent.password === value
              }
              )
            })}
            onSubmit={(values, { setSubmitting }) => updatePassword(values,  setSubmitting )}
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
                    Reset Password
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Update your account password
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={3}
                >
              </Grid>
                <br/>
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
                <TextField
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  fullWidth
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  label="Confirm Password"
                  margin="normal"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.confirmPassword}
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
                    Update Password
                  </Button>
                </Box>
                
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default UpdatePasswordView;
