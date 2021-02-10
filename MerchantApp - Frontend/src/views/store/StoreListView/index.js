import React, { useState,useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import ProductCard from './ProductCard';
import Services from '../../../services/Services';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));
const PAGE_LIMIT = 9

const StoreList = () => {
  const classes = useStyles();
  const [stores, setStores] = useState([])
  const [totalStores, setTotalStores] = useState(0)
  const [page, setPage] = React.useState(1);
  const fetchStoresData = async (page=1,searchFilter={}) => {
    try {
      setTotalStores(0)
      const storesData = await Services.getStore(page,searchFilter)
      setStores(storesData.data.storesData);
      var count = storesData.data.count
      count = Math.ceil(parseInt(count)/PAGE_LIMIT)
      setTotalStores(count)
    } catch (e) {
        console.log(e.response);
        
        setStores([]);
    }
};
  useEffect(() => {
    fetchStoresData();
  }, []);
  
const handleChange = (event, value) => {
  setPage(value);
  fetchStoresData(value);

};
const searchStore=(searchString)=>{
  console.log(searchString, "in index.js")
  fetchStoresData(1,searchString)
}
  return (
    <Page
      className={classes.root}
      title="Stores"
    >
     
     
      <Container maxWidth={false}>
        <Toolbar searchStore={searchStore}/>
        {stores.length >0 && (

        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            {stores.map((store) => (
              <Grid
                item
                key={store._id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProductCard
                  className={classes.productCard}
                  store={store}
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
            count={totalStores}
            size="small"
            onChange={handleChange}
            page={page}
          />
        </Box>
      </Container>
    
    </Page>
  );
};

export default StoreList;
