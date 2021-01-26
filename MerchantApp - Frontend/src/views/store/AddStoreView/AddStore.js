import React, { useEffect,useState,useContext } from 'react';
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
  Radio
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
import axios from "axios";

import Autocomplete from 'react-google-autocomplete';
import Map from "../../../components/Map"
import { GlobalContext } from "../../../context/GlobalState";
import {API_URI,ACCESS_TOKEN, GOOGLE_STORAGE_PUBLIC_URL} from '../../../utils/config';

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
  const [selectedStoreType, setSelectedStoreType] = React.useState([]);
  const theme = useTheme();
  const [names, setNames] = useState({storeTypes: []});
  const [open, setOpen] = React.useState(false);
  const [selectedSAC, setSelectedSAC] = React.useState([]);
  const [initialValues, setInitialValues] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const navigate = useNavigate();
  const { storeID, assignStoreID,selectedStore,setSelectedStore} = useContext(GlobalContext);
  

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
  useEffect(() => {
    const fetchStoreTypes = async () => {
        try {
            setNames({storeTypes: names.storeTypes});
            var options= {
                "Authorization" : ACCESS_TOKEN
            }
            const response = await axios.get(API_URI+'/rest/v1/utils/storetype',{"headers":options});
            
            //console.log(names)
            response.data.map((item)=>{
              item.checkedStatus = Array(item.categories.length).fill(false)
            })
            
            if(Object.keys(selectedStore).length !== 0){
              var categoriesData = [];
            selectedStore.storeType.map(item=>{
              var TypeName = response.data.filter((data=>{
                if(item.type === data._id){
                  categoriesData[data._id] = item.categories.map(String)
                  item.categories.map((sc)=>{
                    data.checkedStatus[sc] = true 
                  })
                  
                  return data.type
                }
                
              }))
              setNames({storeTypes: response.data});
              setSelectedStoreType([item.type]);
              setSelectedSAC(categoriesData)            
            })
          }
        } catch (e) {
            console.log(e);
            setNames({storeTypes: names.storeTypes});
        }
    };
 
    fetchStoreTypes();

}, []);
  useEffect(() => {
    const initialData = ()=>{
      if(type==="edit"){
        setisEdit(true)
        console.log(selectedStore)
        if(Object.keys(selectedStore).length == 0){
          
          navigate("/app/stores")
          
          return false
        }
        setInitialValues({
          storeName : selectedStore.name,
          email : selectedStore.email,
          address: selectedStore.address,
          phoneNumber: selectedStore.phoneNumber,
          zipcode: selectedStore.zipcode,
          identity_proof : selectedStore.identity_proof,
          insideMall : selectedStore.insideMall ? "yes":"no",
          mall_name: selectedStore.mall_name,
          latitude : selectedStore.location.coordinates[1],
          longitude : selectedStore.location.coordinates[0],
          profilepic : selectedStore.profilepic,
          _id : selectedStore._id
        })
        setThumbnailImg(GOOGLE_STORAGE_PUBLIC_URL+selectedStore.owner+"/"+selectedStore.profilepic)
        console.log(initialValues)
       

        
      }else{
        setInitialValues({
          storeName:'',
          email: '',
          address:'',
          phoneNumber:'',
          zipcode : '',
          identity_proof : '',
          insideMall : "no",
          mall_name : ''
        })
        console.log(initialValues)
      }
    }
    initialData();

}, []);
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
      
      console.log(values)
      console.log(selectedSAC)
      console.log(profilePic)
      const data = new FormData() 
      data.append('file', profilePic[0])
      var options= {
        "Authorization" : ACCESS_TOKEN
      }
      var storeTypeData=[]
      Object.keys(selectedSAC).map((k)=>
        storeTypeData.push({"type":k,"categories":selectedSAC[k]})
      )
      console.log(storeTypeData)
      var requestPayload = {
        "name" : values.storeName,
        "address" : values.address,
        "zipcode" : values.zipcode,
        "location" : { "type" : "Point", "coordinates":[parseFloat(values.longitude),parseFloat(values.latitude)]},
        "storeType" : storeTypeData,
        "insideMall" : values.insideMall === "yes" ? true : false,
        "mall_name" : values.mall_name,
        "phoneNumber" : values.phoneNumber,
        "email" : values.email,
        "identity_proof" : values.identity_proof,
        "profilepic" : profilePic[0] ? profilePic[0].name : values.profilePic 
      }
      if(storeID){
        requestPayload.hasMainBranch = true
        requestPayload.mainBranchID = storeID
      }
      if( profilePic.length >0){
        const responseData  = await axios.post(API_URI+'/rest/v1/imageupload/',data,{"headers":options});
        console.log(responseData);
      }
      let storeResponse = {}
      if(isEdit){
        requestPayload._id = values._id
         storeResponse  = await axios.put(API_URI+'/rest/v1/store',requestPayload,{"headers":options});
        console.log(storeResponse)
      }else{
         storeResponse  = await axios.post(API_URI+'/rest/v1/store',requestPayload,{"headers":options});
        console.log(storeResponse)
      }
      
      if(storeResponse.status ===200){
        setSelectedStore({})
        setSelectedSAC([])
        setSelectedStoreType([])
        enqueueSnackbar('Store created successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );
        assignStoreID("")
        navigate("/app/stores")
      }


    }catch(e){
      console.log(e)
      setSubmitting(false)
      enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
    }

   // You should see email and password in console.
   // ..code to submit form to backend here...

}
const handleCapture = ({ target }) => {
  console.log(target.files)
  setProfilePic(target.files)
  setThumbnailImg(URL.createObjectURL(target.files[0]))
}

  return (
    <Formik
    enableReinitialize
            initialValues={ { insideMall : "no",...initialValues}}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              address: Yup.string().max(200).required('Address is required'),
              phoneNumber: Yup.string().min(10).max(10).required('Phone number is required'),
              zipcode: Yup.string().max(6).required('zipcode is required'),
              identity_proof: Yup.string().required('identity proof is required'),
              storeName: Yup.string().required('Store name is required'),
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
              values
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
                
        <Autocomplete
							style={{
								width: '100%',
								height: '100%',
								paddingLeft: '16px',
                marginTop: '2px',
                borderRadius: '5px',
                borderColor: 'lightgrey',
                borderWidth: 'thin',
                fontSize: '1rem'
								
							}}
                
                label="Store Name"
                name="storeName"
                onChange={handleChange}
                types={[]}
                required
                value={values.storeName || ''}
                variant="outlined"
                placeholder ="Store name"
						/>
             
              
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address}
                fullWidth
                label="Address"
                name="address"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                value={values.address|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
                label="Email Address"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
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
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                onChange={handleChange}
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
              <TextField
                error={Boolean(touched.zipcode && errors.zipcode)}
                helperText={touched.zipcode && errors.zipcode}
                fullWidth
                label="Zipcode"
                name="zipcode"
                onChange={handleChange}
                type="number"
                value={values.zipcode|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <FormControl className={classes.formControl}>
              <InputLabel id="demo-mutiple-chip-label">Store Type</InputLabel>
        <Select
          error={Boolean(touched.selectedStoreType && errors.selectedStoreType)}
         
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
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
              md={12}
              xs={12}
            >  
             <TextField
                error={Boolean(touched.identity_proof && errors.identity_proof)}
                helperText={touched.identity_proof && errors.identity_proof}
                fullWidth
                label="Enter PAN / Aadhar / GST Number"
                name="identity_proof"
                onChange={handleChange}
               
                value={values.identity_proof|| ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
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
              md={12}
              xs={12}
            >  
             <TextField
                error={Boolean(touched.mall_name && errors.mall_name)}
                helperText={touched.mall_name && errors.mall_name}
                fullWidth
                label="Enter mall name"
                name="mall_name"
                onChange={handleChange}
                required
                value={values.mall_name|| ''}
                variant="outlined"
              />
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
   
    
      <input type="text" name="latitude" value={values.latitude || ''}  onChange={handleChange}/>
      <input type="text" name="longitude" value={values.longitude || ''}  onChange={handleChange}/>
      {!(values.latitude && values.longitude) && (
        <Box
          display="flex"
          justifyContent="flex-end"
          p={4}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleOpen}
          >
            Select store in map
          </Button>
        </Box>
      )}
        
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
    
     center={{lat: 18.5204, lng: 73.8567}}
     height='300px'
     zoom={15}
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
