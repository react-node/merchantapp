import React, { useEffect } from 'react';
import {
  Avatar,
  Container,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import SimpleTab from './simpleTab'
import StoreAddress from './storeDetails'
import useStoreAndOffer from 'src/hooks/useStoreAndOffer';
import { GOOGLE_STORAGE_PUBLIC_URL ,OFFERS_PATH} from 'src/utils/config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: 14
  },
  title:{
    marginTop:5,
    marginBottom:10
  },
  avatar: {
    height: 150,
    width: "100%",
    maxWidth: 400,
    cursor:"pointer"
  },
}));

const StoreInfo = () => {
  const classes = useStyles();
  const {storeDetails,storeOffers, selectedOffer ,getStoreOffers,getStoreDetails} = useStoreAndOffer()
  console.log(storeOffers,selectedOffer)

useEffect(()=>{
  getStoreDetails()
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[])
// const storeInfo ={
//   name:"Test",
//   profilepic : "/static/images/offers2.jpg",
//   address: "Test address"
// }
  return (
    <Page
      className={classes.root}
      title="Home"
    >
      <Container maxWidth={false}>
      <Typography component="div"><h2 className={classes.title}>Latest Offer</h2></Typography> 
               <br />
        <Grid
            container
            
          >
           
                {Object.keys(selectedOffer).length > 0 && 
                  selectedOffer.images.map((item,index)=>(
                  <Grid
                  key={index}
                  item
                  lg={3}
                  md={6}
                  xs={12}
                >
                  <Avatar
                    alt="offer image"
                    src={GOOGLE_STORAGE_PUBLIC_URL+selectedOffer.ownerID+OFFERS_PATH+item.imagePath}
                    variant="square"
                    className={classes.avatar}
                  />
                  </Grid>
            
                ))

                }
                
           
           
        </Grid>
        <br/>
        <Typography component="div"><h2 className={classes.title}>Store Information</h2></Typography>
        <StoreAddress store={storeDetails} />
                <br />
        <SimpleTab storeOffers={storeOffers} getStoreOffers={getStoreOffers}/>
        
      </Container>
    </Page>
  );
};

export default StoreInfo;
