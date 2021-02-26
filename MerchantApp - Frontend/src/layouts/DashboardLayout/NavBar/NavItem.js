import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  Collapse,
  List,
  ListItem,
  makeStyles
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto'
  },
  active: {
    color: theme.palette.primary.main,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  custPTB:{
    paddingTop:0,
    paddingBottom:0
  }
}));

const NavItem = ({
  className,
  href,
  icon: Icon,
  title,
  children,
  ...rest
}) => {
  const classes = useStyles();
  const [open,setOpen] = useState({
    Slots : false,
    Report : false
  })
  const handleClick = (name)=>{
    // var newObj = {...open}
    // Object.keys(newObj).map((k)=>newObj[k] = false )
    // newObj[name] =  !open[name]
    // setOpen(newObj)
    setOpen({...open, [name] : !open[name]})
  }
  if(!children){
    return (
    
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
        {...rest}
      >
        <Button
          activeClassName={classes.active}
          className={classes.button}
          component={RouterLink}
          to={href}
        >
          {Icon && (
            <Icon
              className={classes.icon}
              size="20"
            />
          )}
          <span className={classes.title}>
            {title}
          </span>
        </Button>
      </ListItem>
    );
  }
  return (
    <div key={title}>
    <ListItem
    disableGutters
       className={classes.custPTB}
      
      {...rest}
      
    >
      <Button
           
            className={classes.button}
            onClick={ () => handleClick( title) }
          >
      {Icon && (
          <Icon
            className={classes.icon}
            size="20"
          />
        )}
         <span className={classes.title}>
              {title}
            </span>
            
        {open[title] ? <ExpandLess /> : <ExpandMore />}
        </Button>
    </ListItem>
    <Collapse in={open[title]} timeout="auto" unmountOnExit>
    <List disablePadding>
      {children.map((menu)=>
      (<ListItem key={menu.title} className={clsx(classes.item,classes.nested, className) }
      disableGutters>
        <Button
            activeClassName={classes.active}
            className={classes.button}
            component={RouterLink}
            to={menu.href}
          >
            {menu.icon && (
              <menu.icon
                className={classes.icon}
                size="20"
              />
            )}
            <span className={classes.title}>
              {menu.title}
            </span>
          </Button>
          
        </ListItem>

      ))

      }
      
    </List>
  </Collapse>
  </div>
  );

  }
  

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavItem;
