import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Avatar, Box, CircularProgress,  GridListTileBar, IconButton, Typography } from '@material-ui/core';
import { GOOGLE_STORAGE_PUBLIC_URL } from 'src/utils/config';
import ConfirmDialog from './ConfirmDialog'
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
  root: {
   
  },
  gridList:{
    marginTop : "25px !important"
  },
  avatar: {
    height: 200,
    width: "100%"
  },
  loading:{
    textAlign:'center'
  }
}));

const ImageGridList =({data,getMoreData,isLoading})=> {
  const classes = useStyles();
  // tracking on which page we currently are
  const [page, setPage] = useState(0);
  const [selectedImages,setSelectedImages]=useState([])
  const [imagesData,setImagesdata] = useState([])
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
       imagesData.map((item=> item.isSelect= false))
       console.log(imagesData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  useEffect(()=>{
    setImagesdata(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])
  useEffect(() => {
    // here we simulate adding new posts to List
    if(page){
      getMoreData(page)
      console.log("call function to get new records",page)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])
  const handleObserver = (entities) => {
    
    const target = entities[0];
    if (target.isIntersecting) {   
        setPage((page) => page + 1)
    }
  }
  const selectImage=(id)=>{
    //let image= selectedImages
    console.log(imagesData)
    let isNew = !selectedImages.includes(id)
    if(isNew){
      setSelectedImages([...selectedImages,id])

    }else{
      //selectedImages.splice(id,1)
      const filteredItems = selectedImages.filter(function(item) {
        return item !== id
      })
      setSelectedImages(filteredItems)
    }
   const modifiedArray = imagesData.map((item)=>{ 
      if(item._id === id){
        item.isSelect = !item.isSelect
      }
      return item
    })
    setImagesdata(modifiedArray)
  }
  const deleteImages=()=>{
    console.log(imagesData)

    console.log(selectedImages)
    const afterdeleteArray= imagesData.filter(item => !selectedImages.includes(item._id))
    console.log(afterdeleteArray)
    setImagesdata(afterdeleteArray)
    setSelectedImages([])
  }
  return (
    <Box>
      {selectedImages.length>0 &&  (
        <Typography variant="body2" style={{textAlign:"center" }}>
          
          <ConfirmDialog 
          deleteStore={deleteImages} 
          buttonText="Delete Image(s)" 
          message="Are you sure, Do you want to delete the images?"
          >
              <DeleteIcon></DeleteIcon>
          </ConfirmDialog>
        </Typography>
      )}
      <GridList  className={classes.gridList} cols={3} component={"span"}>
        {imagesData.map((item) => (
          <GridListTile key={item._id} cols={item.cols || 1} component={"span"} onClick={()=>selectImage(item._id)}>
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
              actionIcon={
                <IconButton aria-label={`info about ${item.image}`} className={classes.icon}>
                  {item.isSelect && <DoneIcon style={{color:'rgb(255,247,0)'}} fontSize='large' /> }
                </IconButton>
              }
             
            />
          </GridListTile>
        ))}
       
      </GridList>
      <div  className={classes.loading} ref={loader}>
          {isLoading && <CircularProgress />}
      </div>
      </Box>
    
  );
}

export default ImageGridList