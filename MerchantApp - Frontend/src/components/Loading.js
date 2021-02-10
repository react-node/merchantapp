import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useContext } from 'react'
import {GlobalContext} from '../context/GlobalState'
const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
const Loader = ()=>{
    const classes = useStyles();
    const {isLoading} = useContext(GlobalContext);
    //const [open, setOpen] =  useState(isLoading);
 

    //console.log("open....",isLoading)
    return (
        <Backdrop className={classes.backdrop} open={isLoading} >
           <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loader