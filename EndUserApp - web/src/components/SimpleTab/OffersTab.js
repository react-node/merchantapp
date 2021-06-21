import React, { useContext, useEffect, useRef, useState } from 'react'
import OfferCard from 'src/components/Offers/OfferCards';
import { useParams } from 'react-router-dom';
import { Context as GlobalContext } from '../../globalContext/globalContext'
import {useNavigate} from 'react-router-dom'
import { CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    
    loading:{
      textAlign:'center'
    }
  }));
const OffersTab = ({storeOffers,getStoreOffers})=>{
    //const {getStoreOffers} = useStoreAndOffer()
    const {storeID,offerID} = useParams()
    const classes = useStyles();
    const {getAccessToken,setOffersPage,state} = useContext(GlobalContext)

    const accessToken = getAccessToken()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(state.offersPage);
    // add loader refrence 
    const loader = useRef(null);
     //perfect fix to memory leak when unmount the component.
     const unmounted = useRef(false);
     useEffect(() => {
         return () => { 
             unmounted.current = true 
         }
     }, []);
    const goToDetails=(storeID,offerID)=>{
        if(!accessToken){
            navigate(`/store/${storeID}/${offerID}`)
        }
    }
    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {   
            setPage((page) => page + 1)
            
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

        return ()=>{setOffersPage(page+1)}
    },[])
    useEffect(()=>{
        
        (async ()=>{
            try{
                console.log(page)
                setIsLoading(true)
                await getStoreOffers(page)
                if(!unmounted.current){
                setIsLoading(false)}
            }catch(err){

            }
            
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[page])
    
    return (
        <>
        {storeOffers.map((item)=>(
        <Grid
        key = {item._id}
        item
        lg={4}
        md={6}
        xs={12}
      >
       <OfferCard goToDetails={goToDetails} offer={item} storeID={storeID}/>
       </Grid>
     ))}
     <div  className={classes.loading} ref={loader}>
          {isLoading && <CircularProgress />}
      </div>
     </>
     )

}

export default OffersTab