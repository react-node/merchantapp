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
  makeStyles,
  FormHelperText
} from '@material-ui/core';
import Services from 'src/services/Services';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {GlobalContext} from "../../../context/GlobalState"
import { useSnackbar } from 'notistack';
import { IDENTITY_PROOF_PATH} from 'src/utils/config';


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [profileData, setProfileData] = useState({});
  //const [userID, setUserID] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const navigate = useNavigate()
  const {setLoading,getIDProofVerified,setAccessToken,setIDProofVerified} = useContext(GlobalContext)
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
        if(!getIDProofVerified() && profileData.data.identityProofs.length===0){
          enqueueSnackbar('Please update your profile details...!',   { variant: "info","anchorOrigin" : alertPosition } );
        }else if(!getIDProofVerified() && profileData.data.identityProofs.length>0){
          enqueueSnackbar('Please wait untill your details will be verified by our team...!',   { variant: "info","anchorOrigin" : alertPosition } );
        }
        setProfileData(profileData.data)
        var initialvalues = {
          firstName : profileData.data.firstName,
          lastName : profileData.data.lastName,
          email: profileData.data.email,
          phoneNumber : profileData.data.phoneNumber,
          PAN:profileData.data.identityProofs[0] ? profileData.data.identityProofs[0].id_number:"",
          aadhaar:profileData.data.identityProofs[1] ? profileData.data.identityProofs[1].id_number : '',
          uploadPAN : "",
          uploadAadhaar : "",

        }
     // setUserID(profileData.data._id)
      setValues(initialvalues)
     
      }
      setLoading(false)
    }catch(err){
      console.log(err)
      setLoading(false)
      if(err.response){
         if(err.response.status ===401){
          setAccessToken('')
          navigate("/")
        }else{
          enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
        }
      }else if(err.request){
        enqueueSnackbar('There is a connection problem, Please try again later...!',   { variant: "error","anchorOrigin" : alertPosition } );
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
        const PANFromData = new FormData()
        PANFromData.append("file",values.uploadPAN[0])
        PANFromData.append("filePath", IDENTITY_PROOF_PATH)
        const AadhaarFromData = new FormData()
        AadhaarFromData.append("file",values.uploadAadhaar[0])
        AadhaarFromData.append("filePath", IDENTITY_PROOF_PATH)
        let promissArray =[]
        if(profileData.identityProofs.length ===0 || values.PAN !== profileData.identityProofs[0].id_number){
          promissArray[0]=   Services.imageUpload(PANFromData)
        }
        if(profileData.identityProofs.length ===0 || values.aadhaar !== profileData.identityProofs[1].id_number){
          promissArray[1]=   Services.imageUpload(AadhaarFromData)
        }
        if(promissArray.length >0){
          Promise.all(promissArray).then(async (result)=>{
            
            await saveProfileData(values,setSubmitting)
           
          }).catch(e=>{
            setSubmitting(false)
            setLoading(false)
            
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
  
          })
        }else{
          await saveProfileData(values,setSubmitting)

        }
        

      }
     
    }catch(e){
      console.log(e)
      setSubmitting(false)
      setLoading(false)
      enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

    }
    

  }
  const saveProfileData= async (values,setSubmitting)=>{
    const requestPayload = {...values,
      identityProofs:[{
        id_type: "PAN",
        id_number : values.PAN,
        upload_path : values.uploadPAN.length>0 ? IDENTITY_PROOF_PATH+"/"+values.uploadPAN[0].name : ""
      },{
        id_type: "Aadhaar",
        id_number : values.aadhaar,
        upload_path : values.uploadAadhaar.length>0 ? IDENTITY_PROOF_PATH+"/"+values.uploadAadhaar[0].name : ''
      }]
    }
    if(profileData.identityProofs.length > 0 && values.PAN === profileData.identityProofs[0].id_number){
      delete requestPayload.identityProofs[0].upload_path
      delete requestPayload.identityProofs[1].upload_path
    }
    try{
      await Services.updateProfile(requestPayload)
      setSubmitting(false)
      setLoading(false)
      enqueueSnackbar('Data updated successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );

    }catch(error){
      setSubmitting(false)
      setLoading(false)
      if(error.response.status === 406){
      enqueueSnackbar('Phone number existed, Please try again with other phone number...!',   { variant: "error","anchorOrigin" : alertPosition } );

      }else{
        enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
      }
    }
  }
  const handleCapturePAN = ({ target },setFieldValue) => {
    console.log(target.files)
    let files = target.files
      
      let filesArray = [...files]
      setFieldValue('uploadPAN',filesArray)
  }
  const handleCaptureAadhaar = ({ target },setFieldValue) => {
    console.log(target.files)
    let files = target.files
      
    let filesArray = [...files]
    setFieldValue('uploadAadhaar',filesArray)
    
  }
  const checkPANNumber = (val)=>{
    const PANRegExp = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}");
      if(!PANRegExp.test(val)){
        return false
      }
    return true
  }
  let PANError = ""
  async function validatePANNumber (val){
    console.log("vaidating backend....")
    const PANRegExp = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}");
      if(!PANRegExp.test(val)){
        return false
      }
      if(profileData.identityProofs.length ===0 || val !== profileData.identityProofs[0].id_number){
        try{
          await Services.validatePAN(val)  
          return true
        }catch(e){
          if(e.response.status === 404)
          return this.createError({ message: "Something went wrong, Please try again later" });
  
          if(e.response.status === 406)
          return this.createError({ message: "PAN is existed" });
        }
      }

      return true
      
   
    
  }

  const checkAadhaarNumber = (val)=>{
    const aadharRegExp = new RegExp("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$");
      if(!aadharRegExp.test(val) ){
        return false
      }
    return true
  }
  async function validateAadhaarNumber(val){
    const aadharRegExp = new RegExp("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$");
      if(!aadharRegExp.test(val)){
        return false
      }
      if(profileData.identityProofs.length ===0 || val !== profileData.identityProofs[1].id_number){
        try{
          await Services.validateAadhaar(val)  
          return true
        }catch(e){
          if(e.response.status === 404)
          return this.createError({ message: "Something went wrong, Please try again later" });

          if(e.response.status === 406)
          return this.createError({ message: "Aadhaar is existed" });
        }
      }
      return true
  }
  const uploadPANValidation = (val) =>{
    console.log(val)
    if(profileData.identityProofs.length ===  0 ||  val !== profileData.identityProofs[0].id_number){
      return true
    }
    return false
  }
  const uploadAadhaarValidation = (val) =>{
    console.log(val)
    if(profileData.identityProofs.length === 0 ||  val !== profileData.identityProofs[1].id_number){
      return true
    }
    return false
  }
  return (
    <Formik
            enableReinitialize
            initialValues={ {...values}}
            validationSchema={Yup.object().shape({
              firstName : Yup.string().required("First name is required"),
              lastName :  Yup.string().required("Last name is required"),
              phoneNumber :  Yup.string().nullable().required('Phone number is required').min(10).max(10),
              PAN : Yup.string().required("Enter PAN number")
              .test("validate-pan",
              "Please enter valid PAN number",
              checkPANNumber
             
              ).test("validate-pan-backend",
              PANError,
              validatePANNumber
              ),
              aadhaar : Yup.string().required("Enter Aadhaar").test("validate-aadhaar",
              "Please enter valid aadhaar number",
              checkAadhaarNumber
            
              ).test("validate-aadhaar-backend",
              "Aadhaar number already existed",
              validateAadhaarNumber
              ),
              uploadPAN :Yup.array().when('PAN',{
                is:(val)=>uploadPANValidation(val),
                then: Yup.array().required("PAN is required"),
                otherwise : Yup.array().notRequired()
              }),
              uploadAadhaar : Yup.array().when('aadhaar',{
                is:(val)=>uploadAadhaarValidation(val),
                then: Yup.array().required("Aadhaar is required"),
                otherwise : Yup.array().notRequired()
              }),
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
                required
                value={values.phoneNumber  || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean( errors.PAN)}
                helperText={ errors.PAN}
                fullWidth
                label="PAN Number"
                name="PAN"
                onChange={handleChange}
                required
                value={values.PAN  || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Box
                display="flex"
                justifyContent="flex-start"
                p={1}
              >
              <input
                accept="image/*"
                className={classes.input}
                style={{ display: 'none' }}
                id="raised-button-pan"
                type="file"
                name="uploadPAN"
                onChange={(e)=>handleCapturePAN(e,setFieldValue)}
                
              />
              <label htmlFor="raised-button-pan">
                <Button  component="span" >
                  Upload PAN
                </Button>
                
              </label> 
            <FormHelperText  className={`${classes.errorCenter}  ${errors.uploadPAN} ?  Mui-error Mui-required: ''`}>{errors.uploadPAN}</FormHelperText>

            </Box>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean( errors.aadhaar)}
                helperText={ errors.aadhaar}
                fullWidth
                label="Aadhaar Number"
                name="aadhaar"
                onChange={handleChange}
                required
                value={values.aadhaar  || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
              
            >
              <Box
                display="flex"
                justifyContent="flex-start"
                p={1}
              >
              <input
                accept="image/*"
                className={classes.input}
                style={{ display: 'none' }}
                id="raised-button-aadhaar"
                type="file"
                name="uploadAadhaar"
                onChange={(e)=>handleCaptureAadhaar(e,setFieldValue)}
                
              />
              <label htmlFor="raised-button-aadhaar">
                <Button  component="span" >
                  Upload aadhaar
                </Button>
                
              </label> 
            <FormHelperText  className={`${classes.errorCenter}  ${errors.uploadAadhaar} ?  Mui-error Mui-required: ''`}>{errors.uploadAadhaar}</FormHelperText>

            </Box>
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
