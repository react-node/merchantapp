import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import Services from 'src/services/Services';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {GlobalContext} from "../../../context/GlobalState"
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({});
  //const [userID, setUserID] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const navigate = useNavigate()
  const {setLoading} = useContext(GlobalContext)
  // const handleChange = (event) => {
  //   setValues({
  //     ...values,
  //     [event.target.name]: event.target.value
  //   });
  // };
  const getProfiledata= async ()=>{
    try{
      setLoading(true)
      const profileData = await Services.getProfileData()
      if(profileData.status === 200){
        var initialvalues = {
          firstName : profileData.data.firstName,
          lastName : profileData.data.lastName,
          email: profileData.data.email,
          phoneNumber : profileData.data.phoneNumber

        }
     // setUserID(profileData.data._id)
      setValues(initialvalues)
      }
      setLoading(false)
    }catch(err){
      console.log(err)
      setLoading(false)
      enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

      if(err.response.status ===401){
        //setAccesstoken
        navigate("/")

      }
      
    }
  }
  useEffect(()=>{
    getProfiledata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const verifyWithOTP =()=>{
    return true
  }
  const SaveProfile=async (values,setSubmitting)=>{
    try{
      setLoading(true)
      console.log("save profile details")
      console.log(values)
      //before update phone number validate with otp to verify user.
      if(verifyWithOTP()){
        await Services.updateProfile(values)

      }
      setSubmitting(false)
      setLoading(false)
      enqueueSnackbar('Data updated successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );

    }catch(e){
      console.log(e)
      setSubmitting(false)
      setLoading(false)
      enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

    }
    

  }
  return (
    <Formik
            enableReinitialize
            initialValues={ {...values}}
            validationSchema={Yup.object().shape({
              firstName : Yup.string().required("First name is required"),
              lastName :  Yup.string().required("Last name is required"),
              phoneNumber :  Yup.string().required('Phone number is required').min(10).max(10)
            })}
            onSubmit={(values, { setSubmitting }) => SaveProfile(values,  setSubmitting )}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setValues,
              setFieldValue
            }) => (
    <form
      autoComplete="off"
      
      noValidate
      onSubmit={handleSubmit} 
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                //helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName  || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                
                label="Email Address"
                name="email"
                disabled={true}
                required
                value={values.email  || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                onChange={handleChange}
                type="number"
                value={values.phoneNumber  || ''}
                variant="outlined"
              />
            </Grid>
                      
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form> )}
  </Formik>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
