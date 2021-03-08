import React from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import TXNStatus from './TXNStatus'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SlotBookingStatusView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Slot Booking Status"
    >
      <Container maxWidth="lg">
       <TXNStatus></TXNStatus>
      </Container>
    </Page>
  );
};

export default SlotBookingStatusView;
