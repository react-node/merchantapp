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

  const {setLoading,bannerSearchData,selectedSlotsData} = useContext(GlobalContext);
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
  const proceedToPay = async ()=>{
    try{
      setLoading(true)
      console.log(bannerSearchData,total)
      const selectStores =bannerSearchData.selectStore.map(({id,zipcode,selectedDates})=> ({id,zipcode,selectedDates}))
      
      let requestData = {
        
        selectStores : selectStores,
        transactionID : 'test',
        totalPaid : total
      }
      if(bannerSearchData.banner){
        requestData.bannerDetails = {
          id : bannerSearchData.banner._id,
          imagePath : bannerSearchData.banner.imagePath
        }
        const saveData = await Services.saveBannerSlots(requestData)
      }else{
        requestData.offerDetails = {
          id : bannerSearchData.offer._id,
          name : bannerSearchData.offer.offerName
        }
        const saveData = await Services.saveOfferSlots(requestData)
      }
     
      setLoading(false)
      navigate("/app/slot_booking/confirmation")

    }catch(e){
      setLoading(false)

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
            onClick={proceedToPay}
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
