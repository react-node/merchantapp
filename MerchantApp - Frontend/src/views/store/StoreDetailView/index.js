import React, { useContext, useEffect, useState } from 'react';
import {
  
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { GlobalContext } from "../../../context/GlobalState";
import StoreInfo from "./StoreInfo";
import SimpleTabs from './SimpleTabs';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
 
}));

const StoreDetailView = () => {
  const classes = useStyles();
  const { selectedStore } = useContext(GlobalContext);
  


  console.log(selectedStore)

  return (
    <Page
      className={classes.root}
      title="Store Details"
    >
    <Container maxWidth="lg">
      <StoreInfo store = {selectedStore}></StoreInfo>          
      <br/>
      <SimpleTabs />         
      </Container>
    </Page>
  );
};

export default StoreDetailView;
