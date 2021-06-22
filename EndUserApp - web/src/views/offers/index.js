import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import Page from 'src/components/Page';
import MainMenu from 'src/components/MainMenu'
import OfferCard from 'src/components/Offers/OfferCards'
import useDashboard from 'src/hooks/useDashboard';
import { useNavigate, useParams } from 'react-router-dom';
import useLocationData from 'src/hooks/useLocationData';
import StoreCard from 'src/components/Offers/StoreCard';
import useLogin from 'src/hooks/useLogin';
import { Context as GlobalContext } from '../../globalContext/globalContext'

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

const OffersListByCategory = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const {zipcode,lat,lng} = useLocationData()
  const [handleClickOpen] = useLogin()
  const {getAccessToken} = useContext(GlobalContext)
   const accessToken = getAccessToken()
  const {getNearByOffers,updateOfferMetaData} = useDashboard()
  const [nearByStores, setNearByStores] = useState([])

  const [isResponseEmpty, setIsResponseEmpty] = useState(false)
  const {type,category} = useParams()
  //const [categoryID,setCategoryID] = useState(category)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
   // add loader refrence 
   const loader = useRef(null);
  const handleObserver = (entities) => {
    
    const target = entities[0];
    console.log("isIntersection----",target.isIntersecting)
    if (target.isIntersecting) {   
        setPage((page) => page + 1)
    }
  }
  const getNearByOffersData = async (zipcode,page=1)=> {
    setIsLoading(true)

    const storeAndoffersData = await getNearByOffers(zipcode,lat,lng,page,type,category)
    if(storeAndoffersData.length===0){
      setIsResponseEmpty(true)
      
    } else{
      //const data = [...nearByStores,...storeAndoffersData]
      //callback helps to add new data to the previous data.
      setNearByStores((prevState)=>([...prevState,...storeAndoffersData]))
      
      console.log("nearByStores============",nearByStores)
     
    }
    setIsLoading(false)
  }
  useEffect(()=>{
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
    console.log("ddddddd")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  useEffect(()=>{
    console.log("page++++++++++++",page)
    if(page && !isResponseEmpty )
    getNearByOffersData(zipcode,page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page])
 
  // useEffect(()=>{
  //   setNearByStores([])
  //   setIsResponseEmpty(false)
  //   //setPage(1)
    
  // },[zipcode])
  useEffect(()=>{
    //  setNearByStores([])
    // setIsResponseEmpty(false)
    // if(page===1){
    //   setPage(0)
    // }else{
    //   setPage(1)
    // }
    //will trigger in component unmount 
    return ()=>{
      const href = window.location.href
      if(href.includes("offers/"))
      window.location.reload()

    }
    
    
  },[category])
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
  const goToDetails=(storeID,offerID=null)=>{
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
  return (
    <Page
      className={classes.root}
      title="Home"
    >
      <Container maxWidth={false}>
        <MainMenu id={type} category={category}/>
       
        <br/>
        
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
              {item.offers.length > 0 && <OfferCard goToDetails={goToDetails} offer={item.offers[0]} storeName = {item.name} storeID={item._id}  offerMetaData={offerMetaData}/>}  
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

export default OffersListByCategory;
