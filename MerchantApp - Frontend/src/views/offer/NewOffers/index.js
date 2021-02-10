import React from "react"
import OffersForm from "../components/OffersForm"
import {
    Container,
    Grid,
    makeStyles
  } from '@material-ui/core';
import Page from 'src/components/Page';
const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    }
   
  }));
  
const AddOffers=()=>{
    const classes = useStyles();
    return (
        <Page
      className={classes.root}
      title="Add New Offer"
    >
    <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <OffersForm />
        </Grid>
      </Container>
    </Page>
    )
}
export default AddOffers