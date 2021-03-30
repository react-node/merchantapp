import React, { useEffect,useState,useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  useTheme,
  Checkbox,
  FormLabel,
  RadioGroup,
  Radio,
  FormHelperText,
  Typography
} from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Formik } from 'formik';
import {  useSnackbar } from 'notistack';
import * as Yup from 'yup';

import Map from "../../../components/Map"
import { GlobalContext } from "../../../context/GlobalState";
import { GOOGLE_STORAGE_PUBLIC_URL,IDENTITY_PROOF_PATH} from '../../../utils/config';
import MapServices from "../../../services/MapServices"
import Services from 'src/services/Services';
import { Autocomplete } from '@material-ui/lab';

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
    height: 100,
    width: 100
  },
  GSTDocStyle:{
    alignSelf:"center",
    marginLeft : 20
  },
  mt : {
    marginTop : "22px !important"
  }
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
// const names = [
//     'Oliver Hansen',
//     'Van Henry',
//     'April Tucker',
//     'Ralph Hubbard',
//     'Omar Alexander',
//     'Carlos Abbott',
//     'Miriam Wagner',
//     'Bradley Wilkerson',
//     'Virginia Andrews',
//     'Kelly Snyder',
//   ];
  function getStyles(name, selectedStoreType, theme) {
    return {
      fontWeight:
        selectedStoreType.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
const AddStore = ({ className,type, ...rest }) => 
{
  const [isEdit,setisEdit]=useState(false)
  const classes = useStyles();
  const [profilePic, setProfilePic] = useState({});
  const [thumbnailImg, setThumbnailImg] = useState();
  const [selectedStoreType, setSelectedStoreType] = useState([]);
  const theme = useTheme();
  const [names, setNames] = useState({storeTypes: []});
  const [open, setOpen] = useState(false);
  const [selectedSAC, setSelectedSAC] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const navigate = useNavigate();
  const { assignStoreID,selectedStore,setSelectedStore,addStoreData,setAddStoreData} = useContext(GlobalContext);
  const [initialGeoLocation, setinitialGeoLocation] = useState({})
  const [isSelectedFromsuggestions, setIsSelectedFromsuggestions] = useState(false)
  const [storeGoogleId,setStoreGoogleId] = useState(null)
  const [disabledFields,setDisabledFields] = useState({})
  const [mallsData,setMallsData] = useState([])
  const [identityTypeData,setIdentityTypeData] = useState([])
  const [useridentityData,setUseridentityData] = useState([])
  const [isGSTExisted,setIsGSTExisted] = useState(true)
  const initialDisableState = {
    area : false,
    city : false,
    state:false,
    country:false,
    zipcode:false

  }
  //var selectedSAC = selectedSAC || [] 
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    var googleContainer = document.getElementsByClassName('pac-container');
    const containerLength = googleContainer.length;
    for (var i = 0; i < containerLength; i++) {
      if(googleContainer[i].style.display !== "none"){
        googleContainer[i].remove();
      }
    }
     
    setOpen(false);
  };
  // const handleRender = ()=>{
  //   var googleContainer = document.getElementsByClassName('pac-container');
  //   //googleContainer[1].style['z-index'] = 1301;
  // }
  const fetchUserIdentitydata = async ()=>{
    try {
      const identityData = await Services.getProfileData()
      setUseridentityData(identityData.data.identityProofs)
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    const fetchStoreTypes = async () => {
      try {
          setNames({storeTypes: names.storeTypes});
         
          const response = await Services.getStoreTypes()
          
          //console.log(names)
          response.data.map((item)=>{
            item.checkedStatus = Array(item.categories.length).fill(false)
            return item
          })
          
          if(Object.keys(selectedStore).length !== 0){
            var categoriesData = [];
          selectedStore.storeType.map(item=>{
            response.data.filter((data=>{
              if(item.type === data._id){
                categoriesData[data._id] = item.categories.map(String)
                item.categories.map((sc)=>{
                  data.checkedStatus[sc] = true 
                  return null
                })
                
                return data.type
              }
              return null
            }))
            setNames({storeTypes: response.data});
            setSelectedStoreType([item.type]);
            setSelectedSAC(categoriesData)   
            return null      
          })
        }else{
          setNames({storeTypes: response.data});
        }
      } catch (e) {
          console.log(e);
          setNames({storeTypes: names.storeTypes});
      }
  };
    fetchStoreTypes();
    fetchUserIdentitydata()
    var idData= [{
      name : "PAN"
    },{
      name : "AADHAAR"
    },{
      name : "GST"
    }]
    setIdentityTypeData(idData)
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  useEffect(() => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position.coords);
          setinitialGeoLocation({lat : position.coords.latitude,long: position.coords.longitude})
          
          })
    }
    
    const initialData = ()=>{
      if(type==="edit"){
        setisEdit(true)
        console.log(selectedStore)
        if(Object.keys(selectedStore).length === 0){
          
          navigate("/app/stores")
          
          return false
        }
        setDisabledFields({
          area :true ,
          city: true,
          state:true,
          country: true,
          zipcode: true,
          identity_proof: true
        })
        setInitialValues({
          storeName : selectedStore.name,
          email : selectedStore.email,
          addressLine: selectedStore.address,
          phoneNumber: selectedStore.phoneNumber,
          zipcode: selectedStore.zipcode,
          identity_proof : selectedStore.identity_proof,
          insideMall : selectedStore.insideMall ? "yes":"no",
          mall_name: selectedStore.mall_name,
          latitude : selectedStore.location.coordinates[1],
          longitude : selectedStore.location.coordinates[0],
          profilepic : selectedStore.profilepic,
          building : selectedStore.building,
          landmark : selectedStore.landmark,
          area:selectedStore.area,
          city: selectedStore.city,
          state:selectedStore.state,
          country: selectedStore.country,
          website: selectedStore.website,
          _id : selectedStore._id,
          identityType : selectedStore.identity_type,
          GSTDoc : []
        })
        
        setThumbnailImg(GOOGLE_STORAGE_PUBLIC_URL+selectedStore.owner+"/"+selectedStore.profilepic)
        getMallsData(selectedStore.zipcode)
        console.log(initialValues)
       

        
      }else{
        setInitialValues({
          storeName:'',
          email: '',
          addressLine:'',
          phoneNumber:'',
          zipcode : '',
          identity_proof : '',
          insideMall : "no",
          mall_name : '',
          building : "",
          landmark : "",
          area:"",
          city: "",
          state:"",
          country:"",
          website: "",
          identityType : "",
          GSTDoc : []
        })
        setSelectedStoreType([])
        setSelectedSAC([])
        console.log(initialValues)
        setDisabledFields(initialDisableState)
      }
    }
    initialData();

   
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
useEffect(()=>{
  if(isEdit){
    const slecetedMallName = mallsData.filter((item)=>item._id === selectedStore.mall_name)
    setInitialValues({...initialValues,mall_name: slecetedMallName[0]})
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[mallsData])
  // const handleChange = (event) => {
  //   setValues({
  //     ...values,
  //     [event.target.name]: event.target.value
  //   });
   
  //   console.log(values)
  // };

  // const handleChange = event => {
  //   setValues(prevValues => ({
  //     ...prevValues,
  //     // we use the name to tell formik which key of `values` to update.
  //     [event.target.name]: event.target.value
  //   }));
  // }
  const storeTypeHandleChange = (event,storeType,checkedStatus) => {
    console.log(names)
    if(!storeType ){
      setSelectedStoreType(event.target.value);
    }else{
     // checkedStatus[event.target.value] = !checkedStatus[event.target.value]
      names.storeTypes.map((store)=>{
        if(store._id === storeType){
          store.checkedStatus[event.target.value] = !store.checkedStatus[event.target.value]
        }
        return null
      })
      setNames(names)

      selectedSAC[storeType] = selectedSAC[storeType] || []
      if(event.target.checked){
        selectedSAC[storeType].push(event.target.value)
        setSelectedSAC(selectedSAC)
      }else{
        var removedData = selectedSAC || []
        removedData[storeType]= selectedSAC[storeType].filter(function(entry) { return entry !== event.target.value ; });
        setSelectedSAC(removedData)
      }
      //render checkbox again for update the checked status
      // var q = selectedStoreType
      // setSelectedStoreType([])
      // setTimeout(() => {
      //   setSelectedStoreType(q)
      // }, 0);
      


    }
    
    console.log(selectedStoreType)
  };

  const renderCategories=(selected)=>{
    return (
       
        selected.categories.map((category,k)=>(
            <FormControlLabel key={category}
        control={<Checkbox onChange={(event)=>storeTypeHandleChange(event,selected._id,selected.checkedStatus)} name={category} value={k} defaultChecked= {selected.checkedStatus[k]} />}
        label={category}
      />
        ))

    )
  }
  const SaveStore= async (values,setSubmitting )=> {
    try{
      if(!values.latitude && !values.longitude){
        enqueueSnackbar('Please select your store in map..!',   { variant: "error","anchorOrigin" : alertPosition } );
       
        setSubmitting(false)
        return false
      }
      if(selectedStoreType.length===0){
        enqueueSnackbar('Please select Store type..!',   { variant: "error","anchorOrigin" : alertPosition } );
         
        setSubmitting(false)
        return false
      }
      if(!isEdit){
        if(Object.keys(profilePic).length ===0){
          enqueueSnackbar('Please upload the image which shows store name, probebly enterance of store...!',   { variant: "error","anchorOrigin" : alertPosition } );
         
          setSubmitting(false)
          return false
        }
      }
     
      console.log(values)
      console.log(selectedSAC)
      console.log(profilePic)
      const data = new FormData() 
      data.append('file', profilePic[0])
     
      var storeTypeData=[]
      Object.keys(selectedSAC).map((k)=>
        storeTypeData.push({"type":k,"categories":selectedSAC[k]})
      )
      console.log(storeTypeData)
      var requestPayload = {
        "name" : values.storeName,
        "address" : values.addressLine,
        "area" : values.area,
        "building" : values.building,
        "landmark":values.landmark,
        "city" : values.city,
        "state" : values.state,
        "country":values.country,
        "zipcode" : values.zipcode,
        "location" : { "type" : "Point", "coordinates":[parseFloat(values.longitude),parseFloat(values.latitude)]},
        "storeType" : storeTypeData,
        "insideMall" : values.insideMall === "yes" ? true : false,
        "mall_name" : values.mall_name,
        "phoneNumber" : values.phoneNumber,
        "email" : values.email,
        "identity_proof" : values.identity_proof,
        "profilepic" : profilePic[0] ? profilePic[0].name : values.profilePic ,
        "website":values.website,
        "identity_type" : values.identityType.name
      }
      // if(storeID){
      //   requestPayload.hasMainBranch = true
      //   requestPayload.mainBranchID = storeID
      // }
      if( profilePic.length >0){
        const responseData  = await Services.imageUpload(data);
        console.log(responseData);
      }
      if(values.identityType.name === "GST" && !isGSTExisted && values.GSTDoc.length>0){
       
        const GSTFromData = new FormData()
        GSTFromData.append("file", values.GSTDoc[0])
        GSTFromData.append("filePath", IDENTITY_PROOF_PATH)
        await Services.imageUpload(GSTFromData)
      }
      let storeResponse = {},message="";
      if(isEdit){
        message = "Store updated successfully...!"
        requestPayload._id = values._id
        //storeResponse  = await axios.put(API_URI+'/rest/v1/store',requestPayload,{"headers":options});
        storeResponse  = await Services.updateStore(requestPayload);
        console.log(storeResponse)
      }else{
        message = "Store created successfully...!"
        requestPayload.store_google_id = storeGoogleId
        //storeResponse  = await axios.post(API_URI+'/rest/v1/store',requestPayload,{"headers":options});
        storeResponse  = await Services.saveStore(requestPayload);
        console.log(storeResponse)
      }
      
      if(storeResponse.status ===200){
        await setSelectedStore({})
        console.log(selectedStore)
        setSelectedSAC([])
        setSelectedStoreType([])
        
        enqueueSnackbar(message,  { variant: "success" ,"anchorOrigin" : alertPosition} );
        assignStoreID("")
        navigate("/app/stores")
      }


    }catch(e){
      console.log(e)
      setSubmitting(false)
      if(e.response.status === 409){
        enqueueSnackbar('Store already registerd, Please contact our team if you need any help',   { variant: "error","anchorOrigin" : alertPosition } );

      }else{
        enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

      }
    }

   // You should see email and password in console.
   // ..code to submit form to backend here...

}
const handleCapture = ({ target }) => {
  console.log(target.files)
  setProfilePic(target.files)
  setThumbnailImg(URL.createObjectURL(target.files[0]))
}
const handleGSTCapture = ({ target },setFieldValue) => {
  console.log(target.files)
  const file = [target.files[0]]
  setFieldValue("GSTDoc",file)
}

  const placeInputRef = useRef(null);
  useEffect(() => {
    initPlaceAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  // initialize the google place autocomplete
  const initPlaceAPI = () => {
    if(window.google){
    let autocomplete = new window.google.maps.places.Autocomplete( document.getElementById('place_changed'),);
    new window.google.maps.event.addListener(autocomplete, "place_changed", function () {
      let place = autocomplete.getPlace();
    
     // setValues({...values,latitude:place.geometry.location.lat()})
      console.log(place)
      //setStoreName(place.name)
      const  addressArray =  place.address_components,
      postalCode = MapServices.getPostalCode( addressArray ),
      city = MapServices.getCity( addressArray ),
      state = MapServices.getState( addressArray ),
      country = MapServices.getCountry( addressArray ),
      area = MapServices.getArea( addressArray ),
      website = place.website || "",
      addressLine = MapServices.getAddressLine(addressArray);
      setStoreGoogleId(place.place_id)
      setIsSelectedFromsuggestions(true)
      setInitialValues({...addStoreData,
        latitude: place.geometry.location.lat(),
        storeName : place.name,
        addressLine,
       // phoneNumber:place.formatted_phone_number,
        longitude : place.geometry.location.lng(),
        zipcode : postalCode,
        city,
        state,
        country,
        website,
        area

        })

        setDisabledFields({
          area : area ? true :false,
          city:city ? true :false,
          state:state ? true :false,
          country:country ? true :false,
          zipcode:postalCode ? true :false,
        })
        getMallsData(postalCode)
      
    });
  }
  };
const updateGeoLocation =(lat,long,city,area,state,country,zipcode)=>{

  console.log(addStoreData)
  setInitialValues({...addStoreData, latitude:lat,longitude : long,city,state,country,area,zipcode})
  setDisabledFields({
    area : area ? true :false,
    city:city ? true :false,
    state:state ? true :false,
    country:country ? true :false,
    zipcode:zipcode ? true :false,
  })
  getMallsData(zipcode)
}
const resetForm=(e)=>{
  if(isSelectedFromsuggestions){
    setInitialValues({...addStoreData,
      latitude: "",
      storeName: e.target.value,
      address : "",
      longitude : "",
      zipcode : ""
      })
      setIsSelectedFromsuggestions(false)
      setStoreGoogleId(null)
      setDisabledFields(initialDisableState)
  }
 
}
const updateStore=(e,val,setValues)=>{

 var attrName = e.target.name,tempvalues={}

  tempvalues[attrName] = e.target.value
  
  setAddStoreData({...val,[e.target.name]:e.target.value})
  if(e.target.name === "zipcode" && e.target.value.length ===6){
    getMallsData(e.target.value)
  }
  
}
const checkValidNumber = (val)=>{
  console.log(val)
  // Regex to check valid Aadhar number.
  const aadharRegExp = new RegExp("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$");
  const GSTRegExp = new RegExp("^[0-9]{2}[A-Z]{5}[0-9]{4}"
  + "[A-Z]{1}[1-9A-Z]{1}"
  + "Z[0-9A-Z]{1}$")
  const PANRegExp = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}");
  if(!aadharRegExp.test(val) && !GSTRegExp.test(val) && !PANRegExp.test(val)){
    return false
  }
  return true
}
const getMallsData = async (zipcode)=>{
  try {
    console.log("fetching malls data......")
    const response = await Services.getMallsData(zipcode)
    setMallsData(response.data)
    
  } catch (error) {
    
  }
}
const setIdentityValue=  (value, setFieldValue)=>{
  console.log(value)
  //if(value){
    if(!value || value.name === "GST"){
      setFieldValue("identity_proof","")
      setDisabledFields({...disabledFields,identity_proof : false})
      
    }else{
      useridentityData.forEach(async (item)=>{
        if(item.id_type.toLowerCase() === value.name.toLowerCase()){

          await setFieldValue("identity_proof", item.id_number)
          setFieldValue("GSTDoc", [])
          setDisabledFields({...disabledFields,identity_proof : true})
          setIsGSTExisted(true)
          return false;
        }
        
      })
    }
  // }else{
  //   setFieldValue("identity_proof","")
  //   setDisabledFields({...disabledFields,identity_proof : false})
  // }

}
const checkGSTNumber =async (e,value)=>{
  
  try {
    if(e.target.value){
      await Services.checkGSTNumber(e.target.value)
      setIsGSTExisted(true)
    }
  } catch (error) {
    if(error.response.status === 404){
      // user should upload the GST document if not existed in db
      setIsGSTExisted(false)
    }
  }
}

  return (
        <Formik
        enableReinitialize
            initialValues={ { insideMall : "no",...initialValues}}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              addressLine: Yup.string().max(200).required('Address is required'),
              phoneNumber: Yup.string().required('Phone number is required'),
              zipcode: Yup.string().max(6).required('zipcode is required'),
              identity_proof: Yup.string().required('Identity proof is required')
              .test("validate-id-proof",
              "Please enter valid number",
              checkValidNumber
              ),
              identityType : Yup.string().nullable().required("Please select identity proof type"),
              storeName: Yup.string().required('Store name is required'),
              insideMall: Yup.string().required('Please select is it inside mall or not'),
              mall_name: Yup.string().when("insideMall",{is:(val)=>val ==="yes",then: Yup.string().required("Mall name is required"),
              otherwise: Yup.string().notRequired()}),
              building : Yup.string().max(200).required('Building details are required'),
              area:Yup.string().max(200).required('Area is required'),
              city:Yup.string().max(200).required('City is required'),
              state:Yup.string().max(200).required('State is required'),
              country:Yup.string().max(200).required('Country is required'),
              GSTDoc : Yup
              .array()
              .when("identityType",{is:(val)=> ( !isGSTExisted),then:Yup.array().required("please upload the GST document"),
              otherwise: Yup.array().notRequired()})
             
            })}
            onSubmit={(values, { setSubmitting }) => SaveStore(values,  setSubmitting )}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,setValues,
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
          subheader={!isEdit? "Create new store" : "Update your store" }
          title= {!isEdit? "Add Store": "Edit Store" }
          action={
            !(values.latitude && values.longitude) && (
              
              <Box
                display="flex"
                justifyContent="flex-center"
                p={1}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleOpen}
                >
                  Select store in map
                </Button>
              </Box>
              
            )
          }
        >
          
          </CardHeader>
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={12}
              xs={12}
            >
                
                <TextField
                fullWidth
               
                //helperText="Please specify the store name"
                label="Store Name"
                name="storeName"
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues);resetForm(e)}}
                required
                value={values.storeName || ''}
                variant="outlined"
                ref={placeInputRef}
                id="place_changed"
                placeholder=""
              />
          <FormHelperText  className={`${classes.mgLeft} ${errors.storeName}?  Mui-error Mui-required: ''`}>{errors.storeName}</FormHelperText>
              
              
            </Grid>
            
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.building && errors.building)}
                helperText={touched.building && errors.building}
                fullWidth
                label="Building no., Floor, Building name "
                name="building"
                onBlur={handleBlur}
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                required
                value={values.building|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.addressLine && errors.addressLine)}
                helperText={touched.addressLine && errors.addressLine}
                fullWidth
                label="Street, Layout, Sector, Colony"
                name="addressLine"
                onBlur={handleBlur}
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                required
                value={values.addressLine|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.landmark && errors.landmark)}
                helperText={touched.landmark && errors.landmark}
                fullWidth
                label="Landmark (Optional)"
                name="landmark"
                onBlur={handleBlur}
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                value={values.landmark|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.area && errors.area)}
                helperText={touched.area && errors.area}
                fullWidth
                label="Area"
                name="area"
                onBlur={handleBlur}
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                disabled={disabledFields.area}
                required
                value={values.area|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city && errors.city}
                fullWidth
                label="City"
                name="city"
                onBlur={handleBlur}
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                required
                disabled={disabledFields.city}
                value={values.city|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.state && errors.state)}
                helperText={touched.state && errors.state}
                fullWidth
                label="State"
                name="state"
                onBlur={handleBlur}
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                required
                disabled={disabledFields.state}
                value={values.state|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.country && errors.country)}
                helperText={touched.country && errors.country}
                fullWidth
                label="Country"
                name="country"
                onBlur={handleBlur}
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                required
                disabled={disabledFields.country}
                value={values.country|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.zipcode && errors.zipcode)}
                helperText={touched.zipcode && errors.zipcode}
                fullWidth
                label="Zipcode"
                name="zipcode"
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                type="number"
                disabled={disabledFields.zipcode}
                value={values.zipcode|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(errors.email)}
                helperText={ errors.email}
                fullWidth
                label="Email Address"
                name="email"
               
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                required
                value={values.email|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber}
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                type="number"
                value={values.phoneNumber|| ''}
                variant="outlined"
              />
            </Grid>
           
            <Grid
              item
              md={6}
              xs={12}
              
            >
              <FormControl fullWidth>
              <InputLabel id="demo-mutiple-chip-label">Store Type</InputLabel>
        <Select
          error={Boolean(touched.selectedStoreType && errors.selectedStoreType)}
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          className = {classes.mt}
          label="Store type"
          name = "storeType"
          value={selectedStoreType}
          variant="outlined"
          onChange={(event)=>storeTypeHandleChange(event,null)}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {
              selected.map((value) => {
                var filterdArray = names.storeTypes.filter(store=> store._id===value)
                  return (
                    <Chip key={filterdArray[0]._id} label={filterdArray[0].type} className={classes.chip} />
                  )
                
                })}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {names.storeTypes.map((name) => (
            <MenuItem key={name._id} value={name._id}  style={getStyles(name, selectedStoreType, theme)}>
              {name.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(errors.website)}
                helperText={errors.website}
                fullWidth
                label="Website (Optional)"
                name="website"
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                value={values.website|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
            item
            md={6}
            xs={12}
        >
        <Autocomplete
           
            id="identity_type"
            options={identityTypeData}
            value={values.identityType || null}
            name="identityType"
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) =>typeof option === 'string' ? option : option.name}
            onChange={( e,value) => {setFieldValue('identityType', value); setIdentityValue(value,setFieldValue)}}
            renderInput={(params) => <TextField {...params} label="Select ID Proof" variant="outlined" />}
            />
          <FormHelperText  className={`${classes.mgLeft} ${errors.identityType}?  Mui-error Mui-required: ''`}>{errors.identityType}</FormHelperText>
          </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >  
             <TextField
                error={Boolean( errors.identity_proof)}
                helperText={ errors.identity_proof}
                fullWidth
                label="Enter PAN / Aadhar / GST Number"
                name="identity_proof"
                disabled={disabledFields.identity_proof}
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                onBlur={(e,value)=>{handleBlur(e);checkGSTNumber(e,setFieldValue)}}
                value={values.identity_proof|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >  
            <FormControl  className= "MuiFormControl-fullWidth" component="fieldset">
              <FormLabel component="legend">Is it inside Mall</FormLabel>
              <RadioGroup row aria-label="insideMall" name="insideMall" value={values.insideMall} onChange={handleChange}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            </Grid>
            {values.insideMall === 'yes' && (
            <Grid
              item
              md={6}
              xs={12}
            >  
            <Autocomplete
          
           options={mallsData}
           fullWidth
            label="Enter mall name"
            name="mall_name"
            value={values.mall_name|| ''}
            variant="outlined"
           getOptionLabel={(option) =>typeof option === 'string' ? option : option.mallName}
           onChange={( e,value) => setFieldValue('mall_name', value)}
           renderInput={(params) => <TextField {...params} label="Select Mall" variant="outlined" />}
           />
          <FormHelperText  className={`${classes.mgLeft} ${errors.mall_name}?  Mui-error Mui-required: ''`}>{errors.mall_name}</FormHelperText>

             {/* <TextField
                error={Boolean(touched.mall_name && errors.mall_name)}
                helperText={touched.mall_name && errors.mall_name}
                fullWidth
                label="Enter mall name"
                name="mall_name"
                onChange={(e)=>{handleChange(e);updateStore(e,values,setValues)}}
                required
                value={values.mall_name|| ''}
                variant="outlined"
              /> */}
            </Grid>
            )}
           
            {
              selectedStoreType.map((selected)=> {
                var filterdArray = names.storeTypes.filter(store=> store._id===selected)
                return (
                  <Grid
                  item
                  md={12}
                  xs={12}
                  key={selected}
                >
                    
                    <h3>{filterdArray[0].type}</h3>
                    {renderCategories(filterdArray[0])}
                    
                    </Grid>
                    )
              })
            
            }
      <input type="hidden" name="latitude" value={values.latitude || ''}  onChange={handleChange}/>
      <input type="hidden" name="longitude" value={values.longitude || ''}  onChange={handleChange}/>
      
        
        <Box
          display="flex"
          justifyContent="flex-end"
          p={4}
        >
        <input
          accept="image/*"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleCapture}
          
        />
        <label htmlFor="raised-button-file">
          <Button  component="span" >
            Upload store image
          </Button>
          
        </label> 
      </Box> 
      <Avatar
            className={classes.avatar}
            src={thumbnailImg}
          />
          {!isGSTExisted && 
            <>
       <Grid direction="row" container>
            <Box
            display="flex"
            justifyContent="flex-end"
            
            p={4}
            >
            <input
            accept="image/*"
            className={classes.input}
            style={{ display: 'none' }}
            id="raised-button-gst"
            type="file"
            onChange={(e) =>handleGSTCapture(e,setFieldValue)}
            name="GSTDoc"
            />
            <label htmlFor="raised-button-gst">
              <Button  component="span" >
                Upload GST Document
              </Button>
              
            </label> 
            <FormHelperText  className={`${classes.errorCenter}  ${errors.GSTDoc} ?  Mui-error Mui-required: ''`}>{errors.GSTDoc}</FormHelperText>
            <Typography className={classes.GSTDocStyle}>{values.GSTDoc && values.GSTDoc.length>0 ? values.GSTDoc[0].name : ""}</Typography>
          </Box> 
          </Grid> 

          </>
			 }
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
       // onRendered = {handleRender}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        width = "600"
      >
        <Fade in={open}>
          <div className={classes.paper}>
          <Map
            center={{lat: initialGeoLocation.lat, lng: initialGeoLocation.long}}
            height='300px'
            zoom={15}
            updateGeoLocation = {updateGeoLocation}
            />
          </div>
        </Fade>
      </Modal>
    </form>
  )}
  </Formik>
  );
};

AddStore.propTypes = {
  className: PropTypes.string
};

export default AddStore;
