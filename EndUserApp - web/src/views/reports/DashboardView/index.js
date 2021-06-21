import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import {useNavigate} from 'react-router-dom'

import Page from 'src/components/Page';
import ImageSlider from 'src/components/ImageSlider'
import MainMenu from 'src/components/MainMenu'
import MultiSlideShow from 'src/components/MultiSlideShow'
import OfferCard from 'src/components/Offers/OfferCards'
import StoreCard from 'src/components/Offers/StoreCard'
import useDashboard from '../../../hooks/useDashboard'
import useLocationData from '../../../hooks/useLocationData'
import useLogin from 'src/hooks/useLogin';
import { Context as GlobalContext } from '../../../globalContext/globalContext'
import {  useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: 14
  },
  title:{
    marginTop:5,
    marginBottom:10
  },
  loading:{
    textAlign:'center'
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  const {getSliderImages,getNearByOffers,updateOfferMetaData} = useDashboard()
  const [banners1, setBanners1] = useState([])
  const [banners2, setBanners2] = useState([])
  const [nearByStores, setNearByStores] = useState([])
  const [handleClickOpen] = useLogin()
  const [isLoading, setIsLoading] = useState(false)
  const [isResponseEmpty, setIsResponseEmpty] = useState(false)
  const {zipcode,lat,lng} = useLocationData()
  
  const navigate = useNavigate()

   // tracking on which page we currently are
   const [page, setPage] = useState(0);
   const {getAccessToken} = useContext(GlobalContext)
   const accessToken = getAccessToken()
    // add loader refrence 
  const loader = useRef(null);
  const getBannerImages = async (zipcode)=>{
    const resp = await getSliderImages(zipcode)
   // setBanners(resp.data)
   
    setBanners1(resp.imageslider_1)
    setBanners2(resp.imageslider_2)
    console.log(resp.imageslider_1,resp.imageslider_2)

  }
 
  const handleObserver = (entities) => {
    
    const target = entities[0];
    if (target.isIntersecting) {   
        setPage((page) => page + 1)
    }
  }
  useEffect(()=>{
    // if(!zipcode)                    
    //   enqueueSnackbar('Please select location!',   { variant: "error","anchorOrigin" : alertPosition } );

    setNearByStores([])
    setPage(0)
    setIsResponseEmpty(false)
    // initialize IntersectionObserver
      // and attaching to Load More div
      var options = {
        root: null,
        rootMargin: "20px",
        threshold: 1.0
     };
      const observer = new IntersectionObserver(handleObserver, options);
      if (loader.current) {
         observer.observe(loader.current)
      }
      if(zipcode)
      getBannerImages(zipcode)
    //getNearByOffersData(zipcode)
    //getMultiSliderOffers(zipcode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[zipcode])
  useEffect(()=>{
    console.log("page=====",page)
    if(zipcode && page && !isResponseEmpty )
    getNearByOffersData(zipcode,page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page])
  const getNearByOffersData = async (zipcode,page=1)=> {
    try{
      setIsLoading(true)
      const storeAndoffersData = await getNearByOffers(zipcode,lat,lng,page)
      if(storeAndoffersData.length===0){
        setIsResponseEmpty(true)
      } else{
        console.log(storeAndoffersData)
        // const data = [...nearByStores,...storeAndoffersData]
        //if there are many calls happend and get the responses same time then simple setNearByStore is overwrite the data with latest call response data
        // because useState is async. it wont update immediatly so that some responses data are missing. 
        //to fix it using below code. adding data to previousstate. it is working fine now  
        //
        setNearByStores((prevState)=>([...prevState,...storeAndoffersData]))
        //setNearByStores(data)
       
      }
      setIsLoading(false)
    }catch(err){
      setIsLoading(false)
    }
    
  }
  const goToDetails=(storeID,offerID='')=>{
    if(accessToken){
      if(offerID){
        navigate(`/store/${storeID}/${offerID}`)
      }else{
        navigate(`/store/${storeID}`)

      }
    }else{
      handleClickOpen(true)
    }
    
  }
  const offerMetaData=async (type,offerID)=>{
    try {
      if(accessToken){

        const resp = await updateOfferMetaData(type,offerID)
        const existingData =  nearByStores.map(item => {
           if(item.offers.length===0) return item

           item.offers.forEach((x,index)=>{
            if(x._id === resp._id){
             const newObj = {...x,[type]:resp[type]}
             item.offers[index] = newObj
              
            }
            
          })
          return {...item}
         
        })
        console.log(existingData)
        setNearByStores(existingData)
        
      }else{
        handleClickOpen(true)
      }
    } catch (error) {
      
    }
    
    
  }
  return (
    <Page
      className={classes.root}
      title="Home"
    >
      <Container maxWidth={false}>
        <MainMenu />
        <ImageSlider fadeImages={banners1}/>
        <MultiSlideShow />
        <br/>
        <ImageSlider  fadeImages={banners2}/>
        <Typography component="div"><h2 className={classes.title}>Popular Deals near you</h2></Typography>
        <Grid
            container
            spacing={3}
          >
            {nearByStores.length > 0 && nearByStores.map(item=>(
              <Grid
                key = {item._id}
                item
                lg={4}
                md={6}
                xs={12}
              >
              {item.offers.length > 0 && <OfferCard goToDetails={goToDetails} offer={item.offers[0]} storeName = {item.name} storeID={item._id} offerMetaData={offerMetaData}/>}  
              {item.offers.length === 0 && <StoreCard  goToDetails={goToDetails}  store={item}/>}  
              
            </Grid>
            )) }
            
            
           
        </Grid>
      </Container>
      <div  className={classes.loading} ref={loader}>
          {isLoading && <CircularProgress />}
      </div>
    </Page>
  );
};

export default Dashboard;
