import React from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import SlotsForm from './SlotsForm';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SlotBookingView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Slot Booking"
    >
      <Container maxWidth="lg">
      <Toolbar />
    
      
          <SlotsForm type="banner"/>
       
      </Container>
    </Page>
  );
};

export default SlotBookingView;
