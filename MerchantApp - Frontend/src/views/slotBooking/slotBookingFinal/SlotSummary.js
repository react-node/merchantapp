import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import {GlobalContext} from "../../../context/GlobalState"
import { useNavigate } from 'react-router-dom';
import Services from 'src/services/Services';
import { useSnackbar } from 'notistack';



const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  custP: {
    padding:4
  },
  custPL : {
    paddingLeft:16
  }
}));
//const PRICE = 200;
const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate()
  const [priceInfo,setPriceInfo] = useState({})
  const _isMounted = useRef(true); // Initial value _isMounted = true //prevent memory leak
  //const [Price,setPrice] = useState(200)
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const {setLoading,bannerSearchData} = useContext(GlobalContext);
  console.log(bannerSearchData)
  useEffect(()=>{
    if(Object.keys(bannerSearchData).length===0)
    navigate("/app/slot_booking")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  let total=0
  const fetchConstData = async (type)=>{
    
    const priceInfo = await Services.getPrice(type)
    if (_isMounted.current) {
      setPriceInfo(priceInfo.data)
    }
  }
  useEffect(()=>{
    var type= "offer"
    if(bannerSearchData.banner){
      type= "banner"
    }
    fetchConstData(type)
    return () => { // ComponentWillUnmount in Class Component
      _isMounted.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  // const proceedToPay = async ()=>{
  //   try{
  //     setLoading(true)
  //     console.log(bannerSearchData,total)
  //     const selectStores =bannerSearchData.selectStore.map(({id,zipcode,selectedDates})=> ({id,zipcode,selectedDates}))
      
  //     let requestData = {
       
  //       selectStores : selectStores,
  //       totalPaid : total
  //     }
  //     if(bannerSearchData.banner){
  //       requestData.bannerDetails = {
  //         id : bannerSearchData.banner._id,
  //         imagePath : bannerSearchData.banner.imagePath
  //       }
  //       await Services.saveBannerSlots(requestData)
  //     }else{
  //       requestData.offerDetails = {
  //         id : bannerSearchData.offer._id,
  //         name : bannerSearchData.offer.offerName
  //       }
  //       await Services.saveOfferSlots(requestData)
  //     }
  //     makePayment(requestData)
     
  //     setLoading(false)
  //     navigate("/app/slot_booking/confirmation")

  //   }catch(e){
  //     setLoading(false)

  //   }
  // }
  function isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
  }
  
  function isObj(val) {
    return typeof val === 'object'
  }
  
   function stringifyValue(val) {
    if (isObj(val) && !isDate(val)) {
      return JSON.stringify(val)
    } else {
      return val
    }
  }
  
  function buildForm({ action, params }) {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)
  
    Object.keys(params).forEach(key => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', stringifyValue(params[key]))
      form.appendChild(input)
    })
  
    return form
  }
  
  function post(details) {
    //setLoading(true)
    const form = buildForm(details)
    document.body.appendChild(form)
    form.submit()
    form.remove()
    //setLoading(false)
  }

  // const getData=(data)=>
  // {

  // return fetch(`http://localhost:3001/rest/v1/payment`,{
  //     method:"POST",
  //     headers:{
  //         Accept:"application/json",
  //         "Content-Type":"application/json"
  //     },
  //     body:JSON.stringify(data)
  // }).then(response=>response.json()).catch(err=>console.log(err))
  // }
  const makePayment=async ()=>
  {
    try {
      setLoading(true)
      const paymentInit = await Services.getPaymentInit({amount:total,bannerSearchData})
      var information={
        action:"https://securegw-stage.paytm.in/order/process",
        params:paymentInit.data
      }
      post(information)
     // setLoading(false)
    } catch (error) {
      setLoading(false)
      enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
      console.log(error)
    }

  }
  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box >
            { Object.keys(bannerSearchData).length >0 &&
            
            (bannerSearchData.selectStore.map((item)=>{
              total = total+(item.selectedDates.length*priceInfo.price)
              return <Grid key={item.id}>
                <Typography >{item.name}</Typography>
                <Grid classes={{item:classes.custP}}  item={true} container direction="row">
                  <Grid item container lg={6} md={6} xs={6}>
                  <Typography classes={{root:classes.custPL}} >Total Selected Dates : {item.selectedDates.length} 
                  </Typography>
                  </Grid>
                  <Grid item container justify="flex-end" lg={6} md={6} xs={6}>
                  <Typography component={'span'}>{priceInfo.price ? item.selectedDates.length * priceInfo.price : '' }</Typography>
                  </Grid>
                </Grid>
                
              </Grid>
              })
            )}
            <br/>
            <Divider />
            <br/>
            <Grid item container justify="flex-end">
                  <Grid > Grand Total : {total}</Grid>
                </Grid>
            </Box>
          </CardContent>
        </Card>
        <Box
          display="flex"
          justifyContent="center"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={makePayment}
          >
            Proceed To Pay
          </Button>
        </Box>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
