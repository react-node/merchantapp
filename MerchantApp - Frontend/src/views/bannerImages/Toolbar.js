import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  makeStyles,
  Typography
} from '@material-ui/core';
import ImagePreview from './ImagePreview'
const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));
const Toolbar = ({ className,HandleUploadImage, ...rest }) => {
  const classes = useStyles();
  const [file,setFile] = useState([])
  const [error,setError] = useState('')
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png"
  ];
  const checkIfFilesAreCorrectType = (files)=> {
    let valid = true
    if (files) {
      let filesArray = [...files]
      filesArray.map(file => {
        if (file.name && !SUPPORTED_FORMATS.includes(file.type)) {
          valid = false
        }
        return valid
      })
    }
    return valid
  }
  const handleCapture = ({ target }) => {
    setError('')
    let files = target.files
    if(checkIfFilesAreCorrectType(files)){
      console.log(files)
      setFile(files)
    }else{
      setError("Invalid Image format. It supports only jpg, jpeg, png")
    }
   
  }
  const uploadImage=()=>{
    HandleUploadImage(file[0])
  }
  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
          display="flex"
          justifyContent="flex-end"
          p={1}
          component={'span'} 
        >
          {file.length>0 &&
          <Button  
          component="span" 
          color="secondary"
          variant="contained"
          onClick={uploadImage}
          >
          Upload
          </Button> 
          }
          &nbsp;
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={(e)=>handleCapture(e)}
          name="offerImgs"
          
        />
        <label htmlFor="raised-button-file">
          <Button  
          component="span" 
          color="primary"
          variant="contained"
          >
          Add Banner Image
          </Button>
        </label>
        
      </Box>
      <Box  
          
          display="flex"
          justifyContent="flex-end"
          >
        {error? <Typography color="primary"> {error}</Typography> : ""}
        </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box >
              <Typography >Uplaod banner images to display all users who are in your zipcoded based on below conditions.
              <br/>1. Uploaded images should be approved.
              <br/>2. Should book the slot to display your banner on specific dates.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <br/>
      {file.length>0 &&
        <ImagePreview 
        file={file}
        />
      }
      
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
