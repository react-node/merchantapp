import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Grid, Link } from '@material-ui/core';
import SearchBar from './SearchBar'
import {Context as GlobalContext} from '../../globalContext/globalContext'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  locationSearch:{
      display:"inline-block",
      margin: "20px 0px"
  },
  cityButton:{
     padding:"5px 20px",
     border:"1px solid #c7bbbbb3",
     borderRadius:25,
     margin:'5px 10px',
     cursor:"pointer",
     color:"#263238",
     "&:hover":{
         color:theme.palette.primary.main,
         border:`1px solid ${theme.palette.primary.main}`,
         textDecoration:"none",
     }
  },
citiesListMargin :{
    marginBottom:20,
    marginRight:10
},

}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SearchModel({open,handleClose}) {
  const classes = useStyles();
  const {state} = useContext(GlobalContext)

  return (
    <div>
    
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            
            <Typography variant="h6" align='center' className={classes.title}>
              Search
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
           
          </Toolbar>
        </AppBar>
        <Grid container  className={classes.locationSearch}>
            <Grid item align="center">
                <SearchBar handleClose={handleClose}/>
            </Grid>
        </Grid>
        {/* <Typography variant="h6" align='center' >
               Search suggestions
            </Typography> */}
          
           <br/>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"

            >
              
            
        </Box>
        
      
      </Dialog>
    </div>
  );
}
