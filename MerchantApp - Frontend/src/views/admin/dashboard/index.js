import React from 'react'
import Page from 'src/components/Page';
import {
    Container,
    makeStyles
  } from '@material-ui/core';
import DashboardList from './components/DashboardList'


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
const AdminDashboardView = () =>{
    const classes = useStyles();
 
    return (
        <Page
    className={classes.root}
    title="Stores List"
    >
        <Container maxWidth={false}>
            <DashboardList />
        </Container>
    </Page>
    )
}


export default AdminDashboardView