import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import LatestProducts from './LatestProducts';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import Services from 'src/services/Services';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [totalStoresCount,setTotalStoresCount] = useState(0)
  const [totalOffersCount,setTotalOffersCount] = useState(0)
  const [totalActiveStoresCount,setTotalActiveStoresCount] = useState(0)
  const [totalActiveOffersCount,setTotalActiveOffersCount] = useState(0)
  const [storesData,setStoresData] = useState([])
  const [offersData,setOffersData] = useState([])

  const fetchDashboardData = async ()=>{
    try{
   
      const responseData = await Services.dashboard()
      setTotalStoresCount(responseData.data.TotalStores)
      setTotalOffersCount(responseData.data.TotalOffers)
      setTotalActiveStoresCount(responseData.data.TotalActiveStores)
      setTotalActiveOffersCount(responseData.data.TotalActiveOffers)
      setStoresData(responseData.data.TotalActiveStoresData)
      setOffersData(responseData.data.TotalActiveOffersData)

    }catch(err){
      console.log(err)

    }
  }

  useEffect(()=>{
    fetchDashboardData()
  },[])

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget totalStoresCount= {totalStoresCount}/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalCustomers totalOffersCount={totalOffersCount}/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress totalActiveStoresCount={totalActiveStoresCount}/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalProfit totalActiveOffersCount={totalActiveOffersCount}/>
          </Grid>
          
         
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts storesData={storesData}/>
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders offersData={offersData}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
