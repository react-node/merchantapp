import React, { useContext, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import Services from 'src/services/Services';
import { GlobalContext } from "../../context/GlobalState";
import { useSnackbar } from 'notistack';
import { BANNER_PATH} from 'src/utils/config';
import { v1 } from 'uuid';
import ImageListView from './BannerImagesListView'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const BannerImageView = () => {
  const classes = useStyles();
  const {setLoading} = useContext(GlobalContext);
  const [bannerImages,setBannerImages] = useState([])
  const [isResponseEmpty, setisResponseEmpty]  = useState(true)

  const [isLoading, setIsLoading]  = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const alertPosition = { horizontal: "right", vertical: "top" }
  const getBannerImages =async (page=1)=>{
    try{
     
      if(isResponseEmpty){
          setIsLoading(true)
          const resultObj = await Services.getBannerImages(page)
         const responseData = resultObj.data.map((d)=>({...d,isSelected:(d.isSelected ? true :false)}))
          console.log(responseData)
          setBannerImages([...bannerImages,...responseData])
          setIsLoading(false)
          if(resultObj.data.length ===0){
            setisResponseEmpty(false)
          }
      }
    }catch(error){
      setIsLoading(false)
    }
  }
  const deleteImage=async (selectedImages)=>{
    try{
      setLoading(true)

      await Services.deleteImages(selectedImages)
      setLoading(false)
     
    } catch(e){
      setLoading(false)
        
    }
  }
  const getMoreData=(page)=>{
    getBannerImages(page)
    console.log( "getting info on page number",page)
  }
  const HandleUploadImage = async (file)=>{
    try{
      setLoading(true)
      const randomString = v1()
      const data = new FormData() 
      data.append('file', file)
      data.append("filePath", BANNER_PATH+randomString)
      await Services.imageUpload(data)
      var requestPayload = {
        imagePath : randomString+"/"+file.name
      }
      await Services.saveBannerData(requestPayload)
      enqueueSnackbar('Image uploaded successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );
      window.location.reload()
      setLoading(false)
    }catch(e){
      setLoading(false)
      enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

    }
  }
  return (
    <Page
      className={classes.root}
      title="Banner Images"
    >
      <Container maxWidth="lg">
      <Toolbar 
        HandleUploadImage={HandleUploadImage}
      />
    
        <Grid
          container
          spacing={3}
        >
          <ImageListView data={bannerImages} getMoreData={getMoreData} isLoading={isLoading} deleteImage={deleteImage} />
        </Grid>
      </Container>
    </Page>
  );
};

export default BannerImageView;
