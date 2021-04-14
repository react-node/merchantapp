import React, { useEffect, useState } from 'react'
import {
    Container,
    makeStyles
  } from '@material-ui/core';
import Page from 'src/components/Page';
import UserForm from '../components/UserForm'
import { useParams } from 'react-router-dom';
import AdminServices from 'src/services/AdminServices';
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
 
const CreateUserView = () =>{
  const classes = useStyles();
  const {id}= useParams()
  const [initialValues,setInitialValues]=useState({})
  const intVal = {
      firstName : "",
      lastName : "",
      email:"",
      password: '',
      city : [],
      zipcode : [],
      phoneNumber : ""
  }
  useEffect(()=>{
    if(id){
      getUserData(id)
  
    }else{
      setInitialValues(intVal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  const getUserData =async (id)=>{
    try{
      const result = await AdminServices.getUserByID(id,2) //2 means get users with assigned city and zipcodes
      const data= result.data
      
      const profileData = data.assignedTo
      setInitialValues({
        firstName : profileData.firstName,
        lastName : profileData.lastName,
        email:profileData.email,
        password: "",
        city : data.assignedData.city,
        zipcode :data.assignedData.zipcodes,
        phoneNumber : profileData.phoneNumber,
        editId : id
      })
    }catch(err){

    }
  }

    return (
        <Page
        className={classes.root}
        title={id ? "Edit user":"Create User"}
      >
       
        <Container maxWidth={false}>
         
        <UserForm initialValues={initialValues}
       />
        </Container>
      
      </Page>
    )
}


export default CreateUserView