import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Link as RouterLink } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Grid, Link } from '@material-ui/core';
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

export default function MenusModel({open,handleClose,categories,type}) {
  const classes = useStyles();
 

  return (
    <div>
    
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            
            <Typography variant="h6" align='center' className={classes.title}>
              Categories
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
           
          </Toolbar>
        </AppBar>
        <br/>
        <br/>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"

            >
              { categories.map((area,index)=>
                <Typography key={area} className={classes.citiesListMargin}>
                    <Link  component={RouterLink}
                    to={`/offers/${type}/${index}`}
                
                className={classes.cityButton}>{area}</Link>
                    </Typography>
                )
              }
              
            
        </Box>
        
      
      </Dialog>
    </div>
  );
}
