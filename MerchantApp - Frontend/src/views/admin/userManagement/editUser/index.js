import React from 'react'
import {
    Container,
    makeStyles
  } from '@material-ui/core';
import Page from 'src/components/Page';
import UserForm from '../components/UserForm'
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
  const searchStore = ()=>{

  }
const CreateUserView = () =>{
  const classes = useStyles();

    return (
        <Page
        className={classes.root}
        title="Create User"
      >
       
        <Container maxWidth={false}>
         
        <UserForm />
        </Container>
      
      </Page>
    )
}


export default CreateUserView