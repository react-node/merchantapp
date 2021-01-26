import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { defaults } from 'chart.js';
import { Avatar, Box, CircularProgress } from '@material-ui/core';
import { GOOGLE_STORAGE_PUBLIC_URL } from 'src/utils/config';


const useStyles = makeStyles((theme) => ({
  root: {
   
  },
  gridList:{
    marginTop : "25px !important"
  },
  avatar: {
    height: 200,
    width: "100%"
  }
}));

const ImageGridList =({data,getMoreData,isLoading})=> {
  const classes = useStyles();
  // tracking on which page we currently are
  const [page, setPage] = useState(1);

  // add loader refrence 
  const loader = useRef(null);

  useEffect(() => {
       var options = {
          root: null,
          rootMargin: "20px",
          threshold: 1.0
       };
      // initialize IntersectionObserver
      // and attaching to Load More div
       const observer = new IntersectionObserver(handleObserver, options);
       if (loader.current) {
          observer.observe(loader.current)
       }

  }, []);
  useEffect(() => {
    // here we simulate adding new posts to List
    
    getMoreData(page)
   console.log("call function to get new records",page)
}, [page])
  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {   
        setPage((page) => page + 1)
    }
}
  return (
    
      <GridList  className={classes.gridList} cols={3} component={"span"}>
        {data.map((item) => (
          <GridListTile key={item._id} cols={item.cols || 1} component={"span"}>
            <Avatar
            component={"span"}
            alt={item.image}
            src={GOOGLE_STORAGE_PUBLIC_URL+item.ownerID+"/"+item.image}
            variant="square"
            className={classes.avatar}
          />
          </GridListTile>
        ))}
       
        <div  className="loading" ref={loader}>
            {isLoading && <CircularProgress />}
                    
           </div>
      
            
       
        
      </GridList>
    
  );
}

export default ImageGridList