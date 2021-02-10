import React, { useState,useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import OfferCard from './OffersCard';
import Services from '../../../services/Services';
import {GlobalContext} from "../../../context/GlobalState"

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

const OfferList = () => {
  const classes = useStyles();
  const {setLoading} = useContext(GlobalContext);
  
  const [offers, setOffers] = useState([])
  const [totalOffers, setTotalOffers] = useState(0)
  const [page, setPage] = React.useState(1);
  const fetchOffersData = async (page=1,searchFilter={}) => {
    try {
      setLoading(true)
      setTotalOffers(0)
      const responseData = await Services.getOffers(page,searchFilter)
      setOffers(responseData.data.offersData);
      var count = responseData.data.count
      count = Math.ceil(parseInt(count)/PAGE_LIMIT)
      setTotalOffers(count)
      setLoading(false)
    } catch (e) {
        console.log(e);
        setOffers([]);
        setLoading(false)
    }
};
  useEffect(() => {
    fetchOffersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
const handleChange = (event, value) => {
  setPage(value);
  fetchOffersData(value);

};
const searchStore=(searchString)=>{
  console.log(searchString, "in index.js")
  fetchOffersData(1,searchString)
}
  return (
    <Page
      className={classes.root}
      title="Offers"
    >
     
     
      <Container maxWidth={false}>
        <Toolbar searchStore={searchStore}/>
        {offers.length >0 && (

        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            {offers.map((offer) => (
              <Grid
                item
                key={offer._id}
                lg={4}
                md={6}
                xs={12}
              >
                <OfferCard
                  className={classes.OfferCard}
                  offer={offer}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
         )}
        <Box
          mt={3}
          display="flex"
          justifyContent="center"
        >
          <Pagination
            color="primary"
            count={totalOffers}
            size="small"
            onChange={handleChange}
            page={page}
          />
        </Box>
      </Container>
    
    </Page>
  );
};

export default OfferList;
