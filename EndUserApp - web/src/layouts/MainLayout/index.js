import React from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import TopBar from './TopBar';
import TopToolBar from './TopToolBar';
import Footer from 'src/components/Footer';
import useGetLocation from 'src/hooks/useGetLocation';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    
    height: '100%',
    
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 20,
    [theme.breakpoints.only('xs')]: {
      paddingTop: 30,
     },
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const MainLayout = () => {
  const classes = useStyles();
  //const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const {error} = useGetLocation()
  // const {setUserLocation} = useContext(GlobalContext)
  // //setUserLocation(location)
  //console.log(location,error)
  return (
    <div className={classes.root}>
      <TopToolBar />
      <TopBar  />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
