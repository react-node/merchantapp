import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles, colors
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import './cardStyle.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  },
  avatar: {
    height: 75,
    width: 75
  },
  customCard : {
    width:75
  },
  uploadDone:{
    color:colors.green[500]
  }

}));

const ImagePreview = ({ className, image, removeImagefromPreview,progressBarValue,...rest }) => {

    const classes = useStyles();
    console.log(rest.index)
    const deleteImage=(imageIndex)=>{
        console.log(imageIndex)
        removeImagefromPreview(imageIndex)
    }
  return (
    <Card >
      <CardContent >
       
          <Avatar
           
            alt="Image"
            src={URL.createObjectURL(image)}
            variant="square"
            className={classes.avatar}
          >
            
          </Avatar>
       
       
      </CardContent>
   
      <Box >
  
         
          <Grid
           
            className={classes.statsItem}
            item
          >
           
              {progressBarValue.percentage ===0 ? ( <DeleteIcon
              className={classes.statsIcon}
              color="action"
              onClick ={()=>deleteImage(rest.index)}
            />) : (progressBarValue.percentage ===100 ?
             <CheckCircleOutlineIcon className={classes.uploadDone}
             color="action" /> :<ErrorOutlineIcon className={classes.statsIcon}
             color="action" />)}
           
           
          </Grid>
        
      </Box>
    </Card>
  );
};


export default ImagePreview;
