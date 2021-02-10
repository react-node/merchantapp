import React, { useEffect, useContext } from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import {GlobalContext} from "../../../context/GlobalState"
import OfferInfo from './OfferInfo'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  OfferCard: {
    height: '100%'
  }
}));

const OfferDetails = () => {
  const classes = useStyles();
  const {setLoading,selectedOffer} = useContext(GlobalContext);
  console.log(selectedOffer)
  
  useEffect(() => {
   // fetchOffersData();
   setLoading(true)
   console.log(selectedOffer)
   setLoading(false)
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Page
      className={classes.root}
      title="Offers"
    >
      <Container maxWidth={false}>
      <OfferInfo offerData = {selectedOffer} />
      </Container>
    </Page>
  );
};
export default OfferDetails;
