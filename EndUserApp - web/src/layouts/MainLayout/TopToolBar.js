import React, { useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  makeStyles,
  Fab,
  Link,
  Hidden
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockIcon from '@material-ui/icons/Lock';
import useLogin from '../../hooks/useLogin'
import useLocation from '../../hooks/useLocation'
import LoginModel from '../../components/Auth/Login'
import LocationModel from '../../components/Location/Location'
import { KeyboardArrowUp } from '@material-ui/icons';
import BackToTop from './BackToTop'
import { Context as GlobalContext } from '../../globalContext/globalContext'
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme)=>({
  root: {},
  toolbar: {
    height: 30,
    minHeight:30,
    background: "#fff8f8",
    color : "#777272",
    fontSize: 12,
    textAlign:'right'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    padding:0
  },
  title: {
    flexGrow: 1,
  },
  links:{
      color:"#777272",
      marginRight : 7,
      fontSize:12,
      verticalAlign:"text-top",
      cursor:'pointer'
  },
  locationIcon:{
      fontSize:14
  },
  vline:{
    borderRight : '1px solid #777272',
    paddingRight : 5
  }
}));

const TopToolBar = ({ className,location, ...rest }) => {
  const classes = useStyles();
  const {getUserLocation,getAccessToken,state,setAccessToken} = useContext(GlobalContext)
  var {loginModel} =state
  const token =getAccessToken()
  const userLocation = getUserLocation() || {}
  console.log(userLocation)
  const navigate = useNavigate()
  const [handleClickOpen,handleClose,handleFormSubmit,sendForgotpasswordLink] = useLogin()
  const [openLocation,handleLocation,handleLocationClose] = useLocation()
  const handleLogout =()=>{
    setAccessToken("")
    navigate('/')
  }

  return (
    <>
    <AppBar
        classes = {{root : classes.toolbar}}
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
     <Toolbar classes = {{root : classes.toolbar}}>
    <Typography edge="start" color="inherit" aria-label="menu" onClick={handleLocation}>
      <LocationOnIcon classes={{root : classes.locationIcon}}/> <span className={classes.links}>{userLocation.location}</span>
    </Typography>
    <Typography className={classes.title}>
    <Hidden mdDown>
      <Link  className={`${classes.links} ${classes.vline}`}> How it work's </Link>
      <Link  className={`${classes.links} ${classes.vline}`}> List your Business </Link>
      </Hidden>
      {token ? (
        <>
          <ExitToAppIcon classes={{root : classes.locationIcon}}/>
          <Link onClick={handleLogout} className={classes.links}> Logout </Link>
        </>
        ) :
        (
        <>
          <LockIcon classes={{root : classes.locationIcon}}/>
          <Link onClick={handleClickOpen} className={classes.links}> Login / SignUp</Link>
        </>
        ) 
      
      
      }
    
    </Typography>
    
  </Toolbar>
  <LoginModel 
  open={loginModel}
  handleClose={handleClose}
  handleFormSubmit={handleFormSubmit}
  sendForgotpasswordLink = {sendForgotpasswordLink}
  />
  <LocationModel 
  open={openLocation}
  handleClose={handleLocationClose}
  />
    </AppBar>
    <Toolbar id="back-to-top-anchor" />

    <BackToTop>
      <Fab color="primary" size="large" aria-label="scroll back to top">
        <KeyboardArrowUp />
      </Fab>
    </BackToTop>
    </>
  );
};
 
TopToolBar.propTypes = {
  className: PropTypes.string
};

export default TopToolBar;
