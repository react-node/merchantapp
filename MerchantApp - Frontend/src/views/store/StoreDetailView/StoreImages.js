
import React, { useContext, useEffect, useState } from 'react'

import { Avatar, Box, Button, colors, Grid,makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ImagePreview from './ImagePreview'
import PublishIcon from '@material-ui/icons/Publish';
import Services from "../../../services/Services"
import { GlobalContext } from "../../../context/GlobalState";
import ImageListView from "./ImagesListView"
const useStyles = makeStyles((theme) => ({
    root: {},
    
    avatar: {
      height: 75,
      width: 75
    }
  }));
const StoreImages = ()=>{
    const classes = useStyles();
    const [isImageSelected,setIsImageSelected]=useState(false);
    const [selectedImages,setSelectedImages] = useState([])
    const [progressInfo,setProgressInfo] = useState([])
    const [storeImages,setStoreImages] = useState([])
    const [isLoading, setIsLoading]  = useState(false)
    const [isResponseEmpty, setisResponseEmpty]  = useState(true)
    const {selectedStore} = useContext(GlobalContext);

    const handleCapture = ({ target }) => {
        let files = target.files
        let filesArray = [...files]
        let progressData=[]
        // let farray = Object.keys(files).map(i=> {filesArray = [...filesArray,files[i]] 
        //     console.log(filesArray)
        // return filesArray})
       
        progressData = filesArray.map((item=> ({percentage: 0, fileName: item.name})))
        console.log(progressData)
        setProgressInfo(progressData)
        setSelectedImages(filesArray)
        setIsImageSelected(true)
        console.log(target.files)
        target.value=""
    }
    const getStoreImages =async (page=1)=>{
        const storeID = selectedStore._id
        if(storeID && isResponseEmpty){
            setIsLoading(true)
            const resultObj = await Services.getstoreImages(storeID,page)
            setStoreImages([...storeImages,...resultObj.data])
            setIsLoading(false)
            if(resultObj.data.length ===0){
              setisResponseEmpty(false)
            }
        }
        
    }

    const uploadImages = async () => {
        try{
            if(Object.keys(selectedStore).length !== 0){
                console.log(selectedImages)
                let requestDataDB = []
                selectedImages.map(async (image,k)=>{
                    console.log(selectedStore)
                    requestDataDB = [...requestDataDB,{image:image.name,storeID : selectedStore._id}]
                    const data = new FormData() 
                    data.append('file', image)
                    image.isComplete = false
                    //setSelectedImages(selectedImages)
                    let pgd = [...progressInfo]
                    pgd[k].percentage=50
                    setProgressInfo(pgd)
                    // const responseData  =  await Services.imageUpload(data)
                    // console.log(responseData)
                    // if(responseData.status===200){
                      
                    // }
                    Services.imageUpload(data).then((data)=>{
                        console.log(data)
                        pgd[k].percentage=100
                        setProgressInfo(pgd)
                    }).catch((error)=>{
                        pgd[k].percentage=-1
                        setProgressInfo(pgd)
                        console.log(error)
                    })
    
                  
    
                })
                console.log(requestDataDB)
                setSelectedImages(selectedImages)
                const result = await Services.storeImages(requestDataDB)
                console.log(result)
            }
            

        }catch(e){
          console.log(e)  
        }
    }
    const removeImagefromPreview =(index)=>{
        console.log("in delete image function")
        var filteredArray = selectedImages.filter((i,k)=>{
             return k!=index
         })
        setSelectedImages(filteredArray)
        
    }
    const getMoreData=(page)=>{
        getStoreImages(page)

        console.log( "getting info on page number",page)
    }
    return (
       
        <Box  component={'div'}  >
            {Object.keys(selectedStore).length !== 0 && (
                <Box
          display="flex"
          justifyContent="flex-end"
          p={1}
          component={'span'} 
        >
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleCapture}

          multiple
        />
         <br />
        {selectedImages.length ===0 ? (
            <label htmlFor="raised-button-file">
            <Button  component="span" >
            Add images 
            </Button>
            
            </label> 
        ):(
            
            <Box  component={'span'}>
               
            <Button variant="outlined" color="secondary" component="span" onClick={uploadImages}>
            <PublishIcon></PublishIcon>Upload
            </Button>
            </Box>
            
        )}

       
      </Box>
            )}
        
      <Grid
        component={'span'}
          container
          spacing={3}
        >
           {progressInfo && selectedImages.map((image,k)=>(
              <Grid
              component={'span'}
              item
              key={k}
              lg={1}
                md={2}
                xs={2}
            >
              <ImagePreview
                className={classes.productCard}
                image={image}
                index={k}
                removeImagefromPreview = {removeImagefromPreview}
                progressBarValue = {progressInfo[k]}
              />
            </Grid>
           ))}
           </Grid> 
           <ImageListView data={storeImages} getMoreData={getMoreData} isLoading={isLoading} />
      </Box>
      
    )
}

export default StoreImages