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
  FormHelperText,
} from '@material-ui/core';
import Services from 'src/services/Services';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {GlobalContext} from "../../context/GlobalState"
import { useSnackbar } from 'notistack';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Autocomplete } from '@material-ui/lab';
import Storeslist from '../offer/components/StoreListMultiSelect'
import Moment from 'moment';

const useStyles = makeStyles(() => ({
  root: {},
  mgLeft : {
    marginLeft :10
  },
}));

const SlotBookingForm = ({ className,type, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [bannersData,setBannersData]  = useState([])
  const [offersData,setOffersData]  = useState([])
  //const [userID, setUserID] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const navigate = useNavigate()
  const {setLoading,setBannerSearchData,setSlotsAvailability} = useContext(GlobalContext)

  const fetchBanners = async ()=>{
      try{
        setLoading(true)
          const resultData = await Services.getBannerImages("all") //to get all the banners data
          setBannersData(resultData.data)
          setLoading(false)
      }catch(e){
        setLoading(false)
        enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
        navigate("/app/dashboard")
      }
  }
  const fetchOffers = async ()=>{
      try{
        setLoading(true)
          const resultData = await Services.getAllOffers() //to get all the banners data
          const offersArray = resultData.data.filter((offer)=> (offer.isActive && offer.status ===2 ))
          setOffersData(offersArray)
          setLoading(false)
      }catch(e){
        setLoading(false)
        enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
        navigate("/app/dashboard")
      }
  }

  useEffect(()=>{
    if(type==="banner"){
      fetchBanners()

    }else if(type === "offer"){
      fetchOffers()
    }
    setValues({
        fromDate:new Date(),
        toDate:new Date(),
        slotType : type
    })
    setBannerSearchData({})
    
    //getProfiledata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const SearchAvailability=async (values,setSubmitting)=>{
    try{
      setLoading(true)
      console.log("save profile details")
      console.log(values)
      const requestData = {...values,
        fromDate : Moment(values.fromDate).format("YYYY-MM-DD"),
        toDate : Moment(values.toDate).format("YYYY-MM-DD"),
      }
      let searchSlotsAvailability={data:[]}
      if(type ==="banner"){
         searchSlotsAvailability = await Services.searchSlots(requestData)

      }else if(type==="offer"){
       searchSlotsAvailability = await Services.searchOfferSlots(requestData)

      }
      let reservedSlotsArray =[]
      searchSlotsAvailability.data.forEach(({selectStores})=>{
          selectStores.map((item)=> reservedSlotsArray.push(item))

      })
      console.log("reservedSlots====",reservedSlotsArray)
      setSlotsAvailability(reservedSlotsArray)
      setBannerSearchData({...values,
        fromDate : Moment(values.fromDate).format("YYYY-MM-DD"),
        toDate : Moment(values.toDate).format("YYYY-MM-DD")
      })
      setSubmitting(false)
      setLoading(false)
    //  enqueueSnackbar('Data updated successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );

    }catch(e){
      console.log(e)
      setSubmitting(false)
      setLoading(false)
      enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

    }

  }
  const getStores = async (value,setFieldValue)=>{
    try{
      console.log(value)
      if(value){
        const stores = await Services.getStoresByID(value.storeID)
        console.log(stores.data)
        const selectedStores = stores.data.map((store)=>{
          return {id:store._id,name:store.name,address : store.address,zipcode: store.zipcode}
        })
        setFieldValue("selectStore",selectedStores)
      }
    }catch(e){

    } 
  }
  const storeHandleChange = (newValues,setFieldValue)=>{
     console.log(newValues,setFieldValue)
    const selectedStoreIds = newValues.map(({_id,zipcode,name})=> ({id:_id,zipcode,name}))
     setFieldValue('selectStore',selectedStoreIds)
   }
   const optionName =(name,createdDate,type)=>{
    
      if(type==="banner"){
      name  = name.split('/')[1]
      }
      const dateTimeFormat = Moment(createdDate).format("YYYY-MM-DD h:mm a")
      return name+", "+dateTimeFormat

   }
  return (
    <Formik
            enableReinitialize
            initialValues={ {...values}}
            validationSchema={Yup.object().shape({
                fromDate : Yup.date().required("From date is required"),
                toDate : Yup.date().required("To date is required"),
                selectStore : Yup.string().required("Store is required"),
                slotType : Yup.string(),
                banner : Yup.string().nullable().when('slotType' ,{is:(val)=>(val ==="banner") ,then: Yup.string().required("Banner is required"),
                otherwise: Yup.string().notRequired()}),
                offer:Yup.string().nullable().when('slotType' ,{is:(val)=>(val ==="offer") ,then: Yup.string().required("Offer is required"),
                otherwise: Yup.string().notRequired()})
            })}
            onSubmit={(values, { setSubmitting }) => SearchAvailability(values,  setSubmitting )}
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
          subheader=""
          title="Slot Booking"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
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
          minDate={values.fromDate}
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
          minDate={values.fromDate}
          onChange={( value) => setFieldValue('toDate', value)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </Grid>
        </MuiPickersUtilsProvider>
        <input type="hidden" name="slotType" value={values.slotType || ''} />
         {type==="banner" && 
         <>
       
        {bannersData.length >0 ? (
            <>
             <Grid
            item
            md={6}
            xs={12}
        >
        <Autocomplete
           
            id="Banners"
            options={bannersData}
            value={values.banner || null}
            name="banner"
            getOptionLabel={(option) =>typeof option === 'string' ? option : optionName(option.imagePath,option.createdAt,"banner")}
            onChange={( e,value) => setFieldValue('banner', value)}
            renderInput={(params) => <TextField {...params} label="Select banner" variant="outlined" />}
            />
          <FormHelperText  className={`${classes.mgLeft} ${errors.banner}?  Mui-error Mui-required: ''`}>{errors.banner}</FormHelperText>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
        >
           <Storeslist 
           storeHandleChange={(newvalue)=>{storeHandleChange(newvalue,setFieldValue)}}/>
          <FormHelperText  className={`${classes.mgLeft} ${errors.selectStore}?  Mui-error Mui-required: ''`}>{errors.selectStore}</FormHelperText>

        </Grid>
          </>
          ) :  (    
            <FormHelperText  className={`${classes.mgLeft} ${errors.selectStore}?  Mui-error Mui-required: ''`}>
              You dont have any approved banners so you can't able to book any slots 
            </FormHelperText>
          )}
            
        </>
            }  
         {type==="offer" && 
         <>
        
        {offersData.length >0 ? (
            <>
            <Grid
            item
            md={6}
            xs={12}
        >
        <Autocomplete
           
            id="Banners"
            options={offersData}
            value={values.offer || null}
            name="offer"
            getOptionLabel={(option) =>typeof option === 'string' ? option : optionName(option.offerName,option.createdAt,"offer")}
            onChange={( e,value) => {setFieldValue('offer', value);getStores(value,setFieldValue)}}
            renderInput={(params) => <TextField {...params} label="Select offer" variant="outlined" />}
            />
          <FormHelperText  className={`${classes.mgLeft} ${errors.offer}?  Mui-error Mui-required: ''`}>{errors.offer}</FormHelperText>
          </Grid>
          </>
          ):(<FormHelperText  className={`${classes.mgLeft} ${errors.selectStore}?  Mui-error Mui-required: ''`}>
              You dont have any approved offers so you can't able to book any slots 
            </FormHelperText>
            )}
            
        </>
            } 
                
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
            Search
          </Button>
        </Box>
      </Card>
    </form> )}
  </Formik>
  );
};

SlotBookingForm.propTypes = {
  className: PropTypes.string
};

export default SlotBookingForm;
