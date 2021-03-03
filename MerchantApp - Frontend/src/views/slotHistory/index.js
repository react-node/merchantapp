import React from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import SlotsHistory from './components'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SlotHistoryView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Slot Booking"
    >
      <Container maxWidth="lg">
        <SlotsHistory></SlotsHistory>
      </Container>
    </Page>
  );
};

export default SlotHistoryView;
