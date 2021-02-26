import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  
  Box,
  Drawer,
  Hidden,
  List,
  makeStyles,
  Typography
} from '@material-ui/core';

import NavItem from './NavItem';
import StorefrontIcon from '@material-ui/icons/Storefront';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import PersonIcon from '@material-ui/icons/Person';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import PerfectScrollbar from 'react-perfect-scrollbar';

const items = [
  {
    href: '/app/dashboard',
    icon: DashboardIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/stores',
    icon: StorefrontIcon,
    title: 'Stores'
  },
  {
    href: '/app/profile',
    icon: PersonIcon,
    title: 'Profile'
  },
  {
    href: '/app/offers',
    icon: LocalOfferIcon,
    title: 'Offers'
  },
  {
    href: '/app/banner_images',
    icon: ViewCarouselIcon,
    title: 'Upload Banners'
  },
  {
   
    icon: LibraryBooksIcon,
    title: 'Slots',
    children : [{
      href: '/app/banner_slot_booking/banner',
      icon: ViewDayIcon,
      title: 'Banner Slots',
    },{
      href: '/app/offer_slot_booking/offer',
      icon: CollectionsBookmarkIcon,
      title: 'Offer Slots',
    }]
  },
  // {
   
  //   icon: LibraryBooksIcon,
  //   title: 'Report',
  //   children : [{
  //     href: '/app/slot_booking',
  //     icon: ViewCarouselIcon,
  //     title: 'Banner Slots',
  //   },{
  //     href: '/app/offer_slot_booking',
  //     icon: LibraryBooksIcon,
  //     title: 'Offer Slots',
  //   }]
  // }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
  
      <Box p={2}>
      <PerfectScrollbar >
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              children = {item.children}
            />
          ))}
        </List>
        </PerfectScrollbar>
      </Box>
      <Box flexGrow={1} />
      <Box
        p={1}
        m={1}
        bgcolor="background.dark"
       
      >
       <Typography variant="subtitle1"> &copy; 2021 Infy Origin </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
