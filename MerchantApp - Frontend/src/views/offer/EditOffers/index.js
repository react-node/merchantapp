import React, { useContext, useEffect } from "react"
import OffersForm from "../components/OffersForm"
import {
  
    Container,
    Grid,
    makeStyles
  } from '@material-ui/core';
  import Page from 'src/components/Page';
  import Loader from 'src/components/Loading'
import {GlobalContext} from "../../../context/GlobalState"
import { useNavigate } from 'react-router-dom';
  

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    }
   
  }));
  
const EditOffers=()=>{
    const classes = useStyles();
    const {selectedOffer} = useContext(GlobalContext);
    const navigate = useNavigate()
    useEffect(()=>{
      if(Object.keys(selectedOffer).length===0)
      navigate("/app/offers")
    })
    return (
        <Page
      className={classes.root}
      title="Edit Offer"
    >
    <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          

          <OffersForm 
            isEdit={true}
           
          />
         
        </Grid>
      </Container>
    </Page>
    )
}

export default EditOffers