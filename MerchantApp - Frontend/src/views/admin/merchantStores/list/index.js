import React from 'react'
import {
    Container,
    makeStyles
  } from '@material-ui/core';
  import Page from 'src/components/Page';

import { Provider as UserManagementProvider } from '../../userManagement/Context/userManagementContext';
import StoresListView from './StoresListView'

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
 
const MerchantStoresListView = ({type}) =>{
  const classes = useStyles();
  
  
  return (
    <UserManagementProvider>
    <Page
    className={classes.root}
    title="Stores List"
    >
        <Container maxWidth={false}>
            <StoresListView type={type}/>
        </Container>
    </Page>
    </UserManagementProvider>
    )
}


export default MerchantStoresListView