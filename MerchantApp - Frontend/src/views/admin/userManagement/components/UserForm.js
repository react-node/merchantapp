import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
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
  makeStyles,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {GlobalContext} from "../../../../context/GlobalState"
import { useSnackbar } from 'notistack';
import CityAndZipcodes from './CityAndZipcodes'
import AdminServices from 'src/services/AdminServices';
import {API_URI} from '../../../../utils/config';
import Services from 'src/services/Services';


const useStyles = makeStyles(() => ({
  root: {}
}));

const UserForm = ({ className,initialValues,...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState(initialValues);
 
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const navigate = useNavigate()
  const {setLoading} = useContext(GlobalContext)
  const handleCityChange = (newValue,setFieldValue)=>{
    setFieldValue("city",newValue)
  }
  const handleZipcodeChange = (newValue,setFieldValue)=>{
    setFieldValue("zipcode",newValue)
  }
  useEffect(()=>{
    setValues(initialValues)
  },[initialValues])
 
  const SaveProfile=async (values,setSubmitting)=>{
    try{
      setLoading(true)
     
      console.log(values)
      values.policy = false
      values.userType = 2
      //values.status = 2
      // values.city.forEach((cityData)=>{
      //   const selectedZipcodes = cityData.zipcodes.filter((item)=> values.zipcode.includes(item))
      //   cityData.zipcodes = selectedZipcodes
      // })
      const {city,zipcode,...formData} = values
      let response
      if(formData.editId){
        
        if(!formData.password)
          delete formData.password
        
        response = await Services.updateProfile(formData)
      }else{
        delete formData.editId 
         response = await Axios.post(API_URI+'/auth/register',formData)
      }
     // const response = await Axios.post(API_URI+'/auth/register',formData)
      console.log(response);
      const id = response.data._id
      await AdminServices.assignCitiesToUser(city,zipcode,id)
      enqueueSnackbar('User created and sent email to activate...',   { variant: "success","anchorOrigin" : alertPosition } );
      setLoading(false)
      navigate('/app/admin/dashboard', { replace: true });
     
     
    }catch(error){
      if(error.response.status===409)
      enqueueSnackbar(error.response.data.error.message,   { variant: "error","anchorOrigin" : alertPosition } );
      else
      enqueueSnackbar('Something went wrong, Please try again later..!',   { variant: "error","anchorOrigin" : alertPosition } );
      setLoading(false)
      setSubmitting(false)

    }
    

  }

  
  return (
    <Formik
            enableReinitialize
            initialValues={ {...values}}
            validationSchema={Yup.object().shape({
              firstName : Yup.string().required("First name is required"),
              lastName :  Yup.string().required("Last name is required"),
              editId :  Yup.string(),
              email : Yup.string().email('Must be a valid email').required("Email is required"),
              phoneNumber : Yup.string().nullable().required("Phone number is required").min(10).max(10),
              password : Yup.string().when("editId",{is:(val)=> !val ,then: Yup.string().required("Password is required"),
              otherwise: Yup.string().notRequired()}),
              city : Yup.string().nullable().required("City is required"),
              zipcode : Yup.string().nullable().required("Zipcode is required"),
             
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
     
      name = "createAdminUser"
      noValidate
      onSubmit={handleSubmit} 
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader={values.editId ? "Edit admin user" : "Create admin user"}
          title="User"
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
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
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                label="Email Address"
                name="email"
                required
                disabled = {values.editId ? true : false}
                onBlur={handleBlur}
                value={values.email  || ''}
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
                label="Phone Number"
                name="phoneNumber"
                required
                onBlur={handleBlur}
                value={values.phoneNumber  || ''}
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
                autoComplete="new-password"
                label="Password"
                name="password"
                onChange={handleChange}
                type="password"
                required ={!values.editId? true:false}
                onBlur={handleBlur}
                value={values.password  || ''}
                variant="outlined"
              />
            </Grid>
            <CityAndZipcodes 
            touched = {touched}
            errors = {errors}
            value={values.city}
           
            zipcodeValue={values.zipcode}
            onHandleCityChange={(newValue)=>handleCityChange(newValue,setFieldValue)}
            onHandleZipcodeChange={(newValue)=>handleZipcodeChange(newValue,setFieldValue)}
            >

            </CityAndZipcodes>
           
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

UserForm.propTypes = {
  className: PropTypes.string
};
UserForm.defaultProps = {
  initialValues : {
    firstName : "",
    lastName : "",
    email:"",
    password: '',
    city : [],
    zipcode : [],
    phoneNumber : "",
    editId:""
  }
}

export default UserForm;
