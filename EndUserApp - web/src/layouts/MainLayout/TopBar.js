import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Box,
  Hidden,
  IconButton,
  makeStyles,fade
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { Context as GlobalContext } from '../../globalContext/globalContext'
import useSearch from '../../hooks/useSearch'
import SearchModel from '../../components/Search'
import Logo from 'src/components/Logo';

const useStyles = makeStyles((theme)=>({
  root: {
    backgroundColor:"white"
  },
  toolbar: {
    height: 64,
    background: theme.palette.background.paper,
   
  },
  custTop:{
    top:30
  },
  search: {
    color: "grey",
    border: `1px solid ${theme.palette.primary.main}`,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const TopBar = ({ className,...rest }) => {
  const classes = useStyles();
  const {state} = useContext(GlobalContext)
  const [handleClickOpen,handleClose] = useSearch()

  var {searchModel} =state
  return (
    <AppBar
    classes = {{root : classes.custTop}}
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Hidden mdDown>
          
        <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onClick={handleClickOpen}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="primary"
           
          >
            <SearchIcon />
          </IconButton>
        </Hidden>
        
      </Toolbar>
      <SearchModel 
      open={searchModel}
      handleClose={handleClose}
      />
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string
};

export default TopBar;
