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
import LocationSearchBar from './LocationSearchBar'
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

export default function Location({open,handleClose}) {
  const classes = useStyles();
  const {state} = useContext(GlobalContext)
  const {popularAreas} = state
  console.log(popularAreas)  

  return (
    <div>
    
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" align='center' className={classes.title}>
              Set Location
            </Typography>
           
          </Toolbar>
        </AppBar>
        <Grid container  className={classes.locationSearch}>
            <Grid item align="center">
                <LocationSearchBar handleClose={handleClose}/>
            </Grid>
        </Grid>
        <Typography variant="h6" align='center' >
              (OR) Select area
            </Typography>
          
           <br/>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"

            >
              { popularAreas.map(area=>
                <Typography key={area} className={classes.citiesListMargin}><Link className={classes.cityButton}>{area}</Link></Typography>
                )
              }
              {
                popularAreas.length === 0 && <Typography className={classes.citiesListMargin}><Link>No suggested areas</Link></Typography>
              }
            
        </Box>
        
      
      </Dialog>
    </div>
  );
}
