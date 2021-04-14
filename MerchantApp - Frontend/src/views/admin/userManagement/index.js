import React from 'react'
import {
    makeStyles
  } from '@material-ui/core';
  import Page from 'src/components/Page';
  import UserListView from '../userManagement/UsersList'

import { Provider as UserManagemantProvider } from '../userManagement/Context/userManagementContext';

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
 
const UserManagementView = () =>{
  const classes = useStyles();
  
    return (
      <UserManagemantProvider>
        <Page
        className={classes.root}
        title="Users List"
        >
          <UserListView />
        </Page>
      </UserManagemantProvider>
    )
}


export default UserManagementView