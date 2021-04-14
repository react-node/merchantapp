import React, { useContext, useEffect } from 'react';
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
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ImageIcon from '@material-ui/icons/Image';
import { GlobalContext } from "../../../context/GlobalState";





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
  const {getUserType} = useContext(GlobalContext);
  const userType = getUserType() 
  const menuItems = [
    {
      href: userType===3 ? '/app/dashboard' : '/app/admin/dashboard' ,
      icon: DashboardIcon,
      title: 'Dashboard',
      userType :[1,2,3]
    },
    {
      href: '/app/admin/users',
      icon: PersonIcon,
      title: 'Admin Users',
      userType :[1]
    },
    {
      href: userType===3 ? '/app/stores' : '/app/admin/stores',
      icon: StorefrontIcon,
      title: 'Stores',
      userType :[3]
    },
    {
      href: '/app/profile',
      icon: PersonIcon,
      title: 'Profile',
      userType :[3]
    },
    {
      href: '/app/offers',
      icon: LocalOfferIcon,
      title: 'Offers',
      userType :[3]
    },
    {
      href: '/app/banner_images',
      icon: ViewCarouselIcon,
      title: 'Upload Banners',
      userType :[3]
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
      }],
      userType :[3]
    },
    {
      href: '/app/slot_history',
      icon: ReceiptIcon,
      title: 'Slot History',
      userType :[3]
    },
    {
      href: '/app/admin/merchant/users',
      icon: PeopleAltIcon,
      title: 'Merchant Users',
      userType :[1,2]
    },
    {
      href: '/app/admin/merchant/stores',
      icon: StorefrontIcon,
      title: 'Merchant Stores',
      userType :[1,2]
    },
    {
      href: '/app/admin/merchant/storeImages',
      icon: ImageIcon,
      title: 'Merchant Store Images',
      userType :[1,2]
    },
    {
      href: '/app/admin/merchant/storeBanners',
      icon: ViewCarouselIcon,
      title: 'Merchant Store Banners',
      userType :[1,2]
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
  const items = menuItems.filter(item=>item.userType.includes(userType))
 
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
