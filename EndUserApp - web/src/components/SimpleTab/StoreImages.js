import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Context as GlobalContext } from '../../globalContext/globalContext'
import { Avatar, CircularProgress, GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useStoreAndOffer from 'src/hooks/useStoreAndOffer';
import { GOOGLE_STORAGE_PUBLIC_URL } from 'src/utils/config';

const useStyles = makeStyles((theme) => ({
    
    loading:{
      textAlign:'center'
    },
    avatar: {
        height: 200,
        width: "100%"
      },
  }));
const StoreImages = ()=>{
    //const {getStoreOffers} = useStoreAndOffer()
    const {storeID,offerID} = useParams()
    const {getStoreImages,storeImages} = useStoreAndOffer()
    const classes = useStyles();
    const {getAccessToken,setStoreImagePage,state} = useContext(GlobalContext)
    const accessToken = getAccessToken()
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(state.storeImagePage);
    // add loader refrence 
    const loader = useRef(null);

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
        return ()=>{
            setStoreImagePage(page+1)
        }
    },[])
    useEffect(()=>{
        
        (async ()=>{
            console.log(page)
            setIsLoading(true)
            await getStoreImages(page)
            setIsLoading(false)
        })();
        
    },[page])
    return (
        <>
        <GridList  className={classes.gridList} cols={3} component={"span"}>
        {storeImages.map((item) => (
          <GridListTile key={item._id} cols={item.cols || 1} component={"span"}>
            <Avatar
            component={"span"}
            alt={item.image}
            src={GOOGLE_STORAGE_PUBLIC_URL+item.ownerID+"/"+item.image}
            variant="square"
            className={classes.avatar}
          />
          <GridListTileBar
              title={item.image}
              subtitle={<span>Uploaded Date: {item.createdAt.slice(0, 10)}</span>}
              
             
            />
          </GridListTile>
        ))}
       
      </GridList>
     <div  className={classes.loading} ref={loader}>
          {isLoading && <CircularProgress />}
      </div>
     </>
     )

}

export default StoreImages