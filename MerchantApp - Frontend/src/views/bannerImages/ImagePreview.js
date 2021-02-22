import { Avatar, makeStyles } from '@material-ui/core'
import React from 'react'
const useStyles = makeStyles((theme) => ({
    root: {},
   
    paper: {
      backgroundColor: theme.palette.background.paper,
      
      padding: theme.spacing(2, 4, 3),
      width: "70%"
    },
    avatar: {
      height: 150,
      width: "100%"
    },
    

  }));
const PreviewImage = ({file})=>{
    const classes = useStyles()
    return (
        <Avatar 
        src={URL.createObjectURL(file[0])}
        variant="square"
        className={classes.avatar}
        ></Avatar>
    )
}

export default PreviewImage;