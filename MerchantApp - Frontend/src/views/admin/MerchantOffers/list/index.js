import React from 'react'
import {
    Container,
    makeStyles
  } from '@material-ui/core';
  import Page from 'src/components/Page';

import { Provider as UserManagementProvider } from '../../userManagement/Context/userManagementContext';
import OffersListView from './OffersListView'

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
 
const MerchantOffersListView = () =>{
  const classes = useStyles();
  
  
  return (
    <UserManagementProvider>
    <Page
    className={classes.root}
    title="Stores List"
    >
        <Container maxWidth={false}>
            <OffersListView />
        </Container>
    </Page>
    </UserManagementProvider>
    )
}


export default MerchantOffersListView