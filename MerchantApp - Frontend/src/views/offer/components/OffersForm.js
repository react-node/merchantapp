import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import StoresList from '../components/StoresList'
import StoresListMultiselect from './StoreListMultiSelect'
import Services from "../../../services/Services"
import {GlobalContext} from "../../../context/GlobalState"
import DeleteIcon from '@material-ui/icons/Delete';
import { GOOGLE_STORAGE_PUBLIC_URL, OFFERS_PATH} from 'src/utils/config';
import ConfirmDialog from '../../store/StoreDetailView/ConfirmDialog'


import {
  Box,
  Button,
  Grid,
  TextField,
  makeStyles,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  GridList,
  Avatar,
  GridListTile,
  IconButton,
  GridListTileBar,
  Typography
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { string } from "prop-types";
import { v1 } from "uuid";
import { useSnackbar } from "notistack";
const useStyles = makeStyles((theme) => ({
    root: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 250,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      
      padding: theme.spacing(2, 4, 3),
      width: "70%"
    },
    avatar: {
      height: 150,
      width: "100%"
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
      },
    center:{
        marginTop: 30
    },
    mgLeft : {
      marginLeft :10
    },
    errorCenter: {
      padding:15,
      marginTop:0
    },
    allignCenter:{
      textAlign:"center"
    }

  }));
const OffersForm=({isEdit=false})=>{
  
    const classes = useStyles();
    const navigate = useNavigate();
    const {setLoading,setSelectedOffer,selectedOffer} = useContext(GlobalContext);
    const [selectedImages,setSelectedImages] = useState([])
    const [initialValues, setInitialValues] = useState({})
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }

    const handleCapture = ({ target },setFieldValue) => {
      let files = target.files
      
      let filesArray = [...selectedImages,...files]
      
      setSelectedImages(filesArray)
      let offerImgs = selectedImages.filter((file)=>!file.isDeleted)
      offerImgs = [...offerImgs,...files]
      setFieldValue('offerImgs',offerImgs)
      console.log(target.files)
      target.value=""
    }
    
    const showOfferOptions=()=>{
        console.log("show options on change")
    }
    const initVal = ()=>{
      if(isEdit){
        console.log("selectedOffer====",selectedOffer)
        let initialData = {
       
          offerName: selectedOffer.offerName,
          offerDescription: selectedOffer.offerDescription,
          fromDate : selectedOffer.fromDate,
          toDate:selectedOffer.expireDate,
          offerType : selectedOffer.discountType,
          selectStore  :selectedOffer.storeID,
          offerDiscount:selectedOffer.discount,
          offerImgs:selectedOffer.images
        }
        
        setInitialValues(initialData);

        setSelectedImages(selectedOffer.images)
      }else{
        setInitialValues({
       
          offerName: "",
          offerDescription: "",
          fromDate : new Date(),
          toDate:new Date(),
          offerType : "",
          selectStore  :"",
          offerImgs:""
        });
      }
    }
    useEffect(()=>{
      const ac = new AbortController();
      initVal()
      return () => ac.abort(); // Abort both fetches on unmount
    },[])

    const storeHandleChange = (newValues,setFieldValue)=>{
     // console.log(e,newValues,setFieldValue)
     const selectedStoreIds = newValues.map((val)=> val._id)
      setFieldValue('selectStore',selectedStoreIds)
    }
    const SaveOffer= async (values,  setSubmitting)=>{
      try{
        setLoading(true)
        //setSubmitting(true)
        console.log(values)
        let randomString =""
        if(isEdit && !selectedOffer.isEditFromIndividualStore){

           randomString = selectedOffer.groupOfStoresByUID

        }else{
           randomString = v1()

        }
        console.log(randomString)
        const imagesWithpath =  selectedImages.map((selectedImage)=>{
          if(selectedImage.name)
          return {imagePath : `${randomString}/${selectedImage.name}`}
          else
          return {...selectedImage}
        })
     //   const selectedStoresIds = values.selectStore.map(())
        let requestPayload =[{
          offerName : values.offerName,
          offerDescription : values.offerDescription,
          fromDate : values.fromDate,
          expireDate : values.toDate,
          discountType:values.offerType,
          discount : values.offerDiscount,
          storeID : values.selectStore,
          groupOfStoresByUID : randomString,
          images : imagesWithpath
        }]
        // const requestPayload = values.selectStore.map((val)=>({
        //   offerName : values.offerName,
        //   offerDescription : values.offerDescription,
        //   fromDate : values.fromDate,
        //   expireDate : values.toDate,
        //   discountType:values.offerType,
        //   discount : values.offerDiscount,
        //   storeID : val,
        //   groupOfStoresByUID : randomString,
        //   images : imagesWithpath
        // }))
        console.log(requestPayload)
        if(!isEdit){
          const offerPostResponse= await Services.saveOffer(requestPayload)
        }else{
          requestPayload[0]._id= selectedOffer._id
          if(requestPayload[0].storeID.length !==1 && selectedOffer.editFromStoreID){
            
              requestPayload[0].EditOfferID= selectedOffer._id
              requestPayload[0].editFromStoreID = selectedOffer.editFromStoreID
              
          }
          
          const offerPostResponse= await Services.updateOffer(requestPayload)

          //if(!selectedOffer.isEditFromIndividualStore){
          //  requestPayload[0]._id= selectedOffer._id
          //}

        }
        
        //console.log(offerPostResponse)
        let promissArray=[]
        
        Promise.all(
          selectedImages.map(async (image,k)=>{
            setSubmitting(true)
            if(image.name){
              const data = new FormData() 
              data.append('file', image)
              data.append("filePath", OFFERS_PATH+randomString)
              const response  =  await Services.imageUpload(data)
              console.log(response)
              return response
            }
            
             // promissArray[k]  =   Services.imageUpload(data)
              
            })
        ).then((result)=>{
          console.log("all promises are completed-------------", result)
          setLoading(false)
          setSubmitting(false)
          enqueueSnackbar('Offer saved successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );

          navigate("/app/offers")
        }).catch((err)=>{
          console.log(`error in promise----${err}`)
          setLoading(false)
          setSubmitting(false)
        enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

        })
        
        // Promise.all(promissArray).then((results)=>{
        //   console.log(results)
        //   setLoading(false)
        //   console.log("end of save function")

        // }).catch((err)=>{
        //   setLoading(false)
        //   console.log(`error in promiss ${err}`)
        // })
       
        
      }catch(e){
        setLoading(false)
        setSubmitting(false)
      }
      

    }
    const FILE_SIZE = 160 * 1024;
    const SUPPORTED_FORMATS = [
      "image/jpg",
      "image/jpeg",
      "image/png"
    ];
  const checkIfFilesAreCorrectType = (files)=> {
    let valid = true
    if (files) {
      files.map(file => {
        if (file.name && !SUPPORTED_FORMATS.includes(file.type)) {
          valid = false
        }
      })
    }
    return valid
  }
  const fileslimit= (files)=>{
    let valid = true
    if (files.length>5) {
      valid=false
    }
    return valid
  }
  const deleteImage=(index,setFieldValue,type)=>{
    console.log(index)
    const offerImgs = selectedImages.filter((img,key)=>{return key!==index})
    if(type==="newImage"){
      
      setSelectedImages(offerImgs)
      
    }else if(type==="existingImage"){
      const filteredArray = selectedImages.filter((img,key)=>{
        if(key==index){
          img.isDeleted = true
        }
        return img
      })
      setSelectedImages(filteredArray)
     
    }
    setFieldValue('offerImgs',offerImgs)
    
  }
  const getTheFormat=(str)=>{
    return str. split('.').pop()
  }
  
    return (
        <Formik
            enableReinitialize
            initialValues={ {...initialValues}}
            validationSchema={Yup.object().shape({
             
              offerName: Yup.string().max(200).required('Offer name is required'),
              offerDescription: Yup.string().max(200),
              fromDate : Yup.date().required("From date is required"),
              toDate : Yup.date().required("To date is required"),
              offerType : Yup.string().required("Offer type is required"),
              offerDiscount : Yup.string().max(2).when("offerType",{is:(val)=>(val ==="FLAT" || val ==="UPTO") ,then: Yup.string().required("Discount is required"),
              otherwise: Yup.string().notRequired()}),
              buy : Yup.string().when("offerType",{is:(val)=>val ==="BUY&GET" ,then: Yup.string().required("Buy and Get values are required"),
              otherwise: Yup.string().notRequired()}),
              selectStore: Yup.string().required('Please select store'),
              offerImgs:  Yup
              .array()
              .required("A file is required")
              .test(
                'is-correct-file',
                'Invalid Image format. It supports only jpg, jpeg, png',
                checkIfFilesAreCorrectType
              ).test(
                'max-file',
                'You can upload max 5 images',
                fileslimit
              )


              
            })}
            onSubmit={(values, { setSubmitting }) => SaveOffer(values,  setSubmitting )}
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
     
    >
      <Card>
        <CardHeader
          subheader={!isEdit? "Create new offer" : "Edit offer" }
          title= {!isEdit? "Add New Offer" : "Update existing offer"}
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
                error={Boolean(touched.offerName && errors.offerName)}
                helperText={touched.offerName && errors.offerName}
                fullWidth
                label="Offer Name"
                name="offerName"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                value={values.offerName|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
                
              <TextField
                error={Boolean(touched.offerDescription && errors.offerDescription)}
                helperText={touched.offerDescription && errors.offerDescription}
                fullWidth
                label="Offer Description"
                name="offerDescription"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                value={values.offerDescription|| ''}
                variant="outlined"
              />
            </Grid>
           
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid
              item
              md={6}
              xs={12}
            >
        <KeyboardDatePicker
          fullWidth
          variant="inline"
          error={Boolean(touched.fromDate && errors.fromDate)}
          helperText={touched.fromDate && errors.fromDate}
          format="MM/dd/yyyy"
          name = "fromDate"
          id="date-picker-fromDate"
          label="From Date"
          value={values.fromDate}
          onChange={( value) => setFieldValue('fromDate', value)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        /></Grid>
         <Grid
              item
              md={6}
              xs={12}
            >
        <KeyboardDatePicker
         error={Boolean(touched.toDate && errors.toDate)}
         helperText={touched.toDate && errors.toDate}
          fullWidth
          variant="inline"
          format="MM/dd/yyyy"
          name = "toDate"
          id="date-picker-toDate"
          label="To Date"
          value={values.toDate}
          onChange={( value) => setFieldValue('toDate', value)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </Grid>
        </MuiPickersUtilsProvider>
           
    <Grid
        item
        md={6}
        xs={12}
    >
        <FormControl fullWidth required 
        >
            <InputLabel id="demo-simple-select-required-label">Offer Type</InputLabel>
            <Select
             error={Boolean( errors.offerType)}
             defaultValue={values.offerType}
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={values.offerType ||''}
            onChange={(e)=>{handleChange(e);showOfferOptions()}}
            className={classes.selectEmpty}
            name="offerType"
            >   
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            <MenuItem value="FLAT">FLAT</MenuItem>
            <MenuItem value="UPTO">UP TO</MenuItem>
            <MenuItem value="BUY&GET">BUY & GET</MenuItem>
            </Select>
            <FormHelperText className="MuiFormHelperText-root MuiFormHelperText-contained" className={errors.offerType ?  'Mui-error Mui-required': ''}>{touched.offerType && errors.offerType}</FormHelperText>
        </FormControl>
    </Grid>
    <Grid
        item
        md={6}
        xs={12}
    >
        {(values.offerType=== "FLAT" || values.offerType=== "UPTO") ? (
              <TextField
                error={ Boolean(errors.offerDiscount)}
                helperText={ errors.offerDiscount}
                type="number"
                fullWidth
                label="Discount percentage"
                name="offerDiscount"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                value={values.offerDiscount|| ''}
                variant="outlined"
              />) : (values.offerType=== "BUY&GET" && (
              <Grid container spacing={2}>
              <Grid 
              
              item 
              md={5}
              xs={4}>
              <TextField
                error = {Boolean(errors.buy)}
                fullWidth
                label="Buy"
                name="buy"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                value={values.buy|| ''}
                variant="outlined"
              />
              </Grid> 
              <span className={classes.center}> & </span>
              <Grid 
              
              item 
              md={5}
              xs={4}>
              <TextField
                error = {Boolean(errors.buy)}
                fullWidth
                label="Get"
                name="get"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                value={values.get|| ''}
                variant="outlined"
              />
              </Grid>
              <FormHelperText className="MuiFormHelperText-root MuiFormHelperText-contained" className={errors.buy ?  'Mui-error Mui-required': ''}>{errors.buy}</FormHelperText>
            </Grid>))}
        </Grid>
        {/* <Grid
      container
      spacing={2}
      item
      >
       <StoresList 
      
      defaultVal= {values.selectStore}
      storeHandleChange={(newvalue)=>{storeHandleChange(newvalue,setFieldValue)}} />  
      <FormHelperText className="MuiFormHelperText-root MuiFormHelperText-contained" className={errors.selectStore ?  'Mui-error Mui-required': ''}>{errors.selectStore}</FormHelperText>
      
      </Grid> */}
      {!selectedOffer.isEditFromIndividualStore && 
      
        <Grid
        container
        spacing={2}
        item
        >
          <StoresListMultiselect
          isError={errors.selectStore}
          defaultVal={values.selectStore}
          storeHandleChange={(newvalue)=>{storeHandleChange(newvalue,setFieldValue)}} />  
          <FormHelperText  className={`${classes.mgLeft} ${errors.selectStore}?  Mui-error Mui-required: ''`}>{errors.selectStore}</FormHelperText>
        </Grid> 
      }
      
        <Box
          display="flex"
          justifyContent="flex-end"
          p={1}
          component={'span'} 
        >
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={(e)=>handleCapture(e,setFieldValue)}
          name="offerImgs"
          multiple
        />
         <label htmlFor="raised-button-file">
            <Button  component="span" >
            Add images 
            </Button>
            
            </label> 

            </Box>
            <FormHelperText  className={`${classes.errorCenter}  ${errors.offerImgs} ?  Mui-error Mui-required: ''`}>{errors.offerImgs}</FormHelperText>

            <GridList  cols={5} component={"span"}>
          {selectedImages && selectedImages.map((item,index) => (
              <GridListTile key={index} cols={item.cols || 1} component={"span"}  >

              {!item.name  && !item.isDeleted && (
                <span>
                <Avatar
                  component={"span"}
                  alt={item.name}
                  src={GOOGLE_STORAGE_PUBLIC_URL+selectedOffer.ownerID+OFFERS_PATH+item.imagePath}
                  variant="square"
                  className={classes.avatar}
                />
                <GridListTileBar
                title={item.name || item.imagePath}
                subtitle={<span>Format: {getTheFormat(item.name ||  item.imagePath)}</span>}
                actionIcon={
 
                      <ConfirmDialog 
                      deleteItem={()=>deleteImage(index,setFieldValue,"existingImage")}
                      buttonText="" 
                      buttonType="iconButton"
                      message="Are you sure, Do you want to delete the offer image?"
                      >
                        <DeleteIcon className={classes.statsIcon} color="error"></DeleteIcon>
                      </ConfirmDialog>
                }
               
                />
               </span>
                )
              }
              {item.name &&  (
                <span>
                <Avatar
                  component={"span"}
                  alt={item.name}
                  src={URL.createObjectURL(item)}
                  variant="square"
                  className={classes.avatar}
                />
                <GridListTileBar
                title={item.name || item.imagePath}
                subtitle={<span>Format: {getTheFormat(item.name ||  item.imagePath)}</span>}
                actionIcon={
                <IconButton  onClick ={()=>deleteImage(index,setFieldValue,"newImage")} aria-label={`info about ${item.name}`} className={classes.icon}>
                    <DeleteIcon
                      className={classes.statsIcon}
                      color="error"
  
                    />
                  </IconButton>
                }
               
                />
                </span>
                )
              }
              </GridListTile>
            
          ))}
       </GridList> 
      
      </Grid>
      
     
        </CardContent>
        <br/>
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
      
    </form>
  )}
  </Formik>
    )
}


export default OffersForm