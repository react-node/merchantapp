import React, { useState,useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Services from '../../../services/Services';
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
const PAGE_LIMIT = 9

const OfferDetails = () => {
  const classes = useStyles();
  const {setLoading,selectedOffer} = useContext(GlobalContext);
  console.log(selectedOffer)
  
  useEffect(() => {
   // fetchOffersData();
   setLoading(true)
   console.log(selectedOffer)
   setLoading(false)
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
