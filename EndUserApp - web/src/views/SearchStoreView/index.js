import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  CircularProgress,
  Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import OfferCard from 'src/components/Offers/OfferCards'
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import StoreCard from 'src/components/Offers/StoreCard';
import useLogin from 'src/hooks/useLogin';
import { Context as GlobalContext } from '../../globalContext/globalContext'
import useSearchFilter from 'src/hooks/useSearchFilter';
import useDashboard from 'src/hooks/useDashboard';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '250px',
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

const SearchStore = () => {
  const classes = useStyles();
  const [stores,setStore] = useState([])
  const [page, setPage] = useState(0);
  const {updateOfferMetaData} = useDashboard()

  const [isResponseEmpty, setIsResponseEmpty] = useState(false)
  const {storeID} = useParams()
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const type = query.get('type');
  const category = query.get('category');
  const searchString = query.get('q');
  const [handleClickOpen] = useLogin()

  const {getStoreAndOffer,getAllStoreAndOffer} = useSearchFilter()
  const navigate=useNavigate()
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
   const unmounted = useRef(false)
  const {getAccessToken} = useContext(GlobalContext)
  const accessToken = getAccessToken()
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
  const getData= async ()=>{
      try {
        setIsLoading(true)
        var resultArray = []
        if(storeID!=="all"){
           resultArray = await getStoreAndOffer(storeID,type,page,category)
        }else{
           resultArray = await getAllStoreAndOffer(searchString,type,page)
        }
        
        if(!unmounted.current){
          if(resultArray.length ===0){
            setIsResponseEmpty(true)
          }else{
            setStore((prevState)=>[...prevState,...resultArray])
          }
            setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
      }
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
    return ()=>{
        unmounted.current = true 
    }
  },[])
  useEffect(()=>{
    if(page!==0  && !isResponseEmpty)
    getData()
  },[page])
  const offerMetaData=async (type,offerID)=>{
    try {
      if(accessToken){

        const resp = await updateOfferMetaData(type,offerID)
        const existingData =  stores.map(item => {
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
        setStore(existingData)
        
      }else{
        handleClickOpen(true)
      }
    } catch (error) {
      
    }
    
    
  }
  useEffect(()=>{
    // setStore([])
    // setIsResponseEmpty(false)
    // setPage(1)
    //will trigger in component unmount 
    return ()=>{
      const href = window.location.href
      if(href.includes("searchstore/"))
      window.location.reload()

    }
  },[storeID,searchString])

  return (
    <Page
      className={classes.root}
      title="Home"
    >
      <Container maxWidth={false}>
       <Typography variant="h6">Search result </Typography>
        <br/>
        
        <Grid
            container
            spacing={3}
          >
           {stores.length > 0 && stores.map(item=>(
              <>
              {item.offers.length > 0 && 
                item.offers.map(data=>(
                  <Grid
                key = {item._id}
                item
                lg={4}
                md={6}
                xs={12}
              >
                    <OfferCard key={data._id} goToDetails={goToDetails} offer={data} storeName = {item.name} storeID={item._id} offerMetaData={offerMetaData} />
                </Grid>
                ))
              
              }  
              {item.offers.length === 0 && 
                (
                  <Grid
                key = {item._id}
                item
                lg={4}
                md={6}
                xs={12}
              >
                  <StoreCard  goToDetails={goToDetails}  store={item}/>
                  </Grid>
                  )}  
              </>
            
            )) }
            
            
        </Grid>
      </Container>
      <div  className={classes.loading} ref={loader}>
          {isLoading && <CircularProgress />}
      </div>
    </Page>
  );
};

export default SearchStore;
