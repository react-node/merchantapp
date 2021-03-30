import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react'
import AdminServices from 'src/services/AdminServices';
import Toolbar from '../components/Toolbar';
import { GlobalContext } from "src/context/GlobalState";
import CustomTable from '../../CommonComponents/CustTableComponent'
import { Context as UserManagemantContext } from '../../userManagement/Context/userManagementContext';
import { Container } from '@material-ui/core';
import { useNavigate} from 'react-router-dom'

const UserListView = () =>{
    const [rows,setRows] = useState([])
    const [count,setCount] = useState(0)
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const {setLoading} = useContext(GlobalContext);

    const {updateSearchCriteria,state} = useContext(UserManagemantContext)
    const {tableSortingDetails} = state
    const alertPosition = { horizontal: "right", vertical: "top" }
    const Headers = [
      { id: 'firstName', numeric: false, disablePadding: true, label: 'First Name', key : "firstName", type : "text",sort : false },
      { id: 'LastName', numeric: false, disablePadding: false, label: 'Last Name', key : "lastName" , type : "text",sort : false},
      { id: 'email', numeric: false, disablePadding: false, label: 'Email' , key : "email", type : "text",sort : true},
      { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone Number', key : "phoneNumber", type : "text" ,sort : false},
      { id: 'isVerified', numeric: false, disablePadding: false, label: 'Status' , key : "isVerified", type : "active",sort : true},
      
    ]
    const tableTitle ="Admin Users"
    const searchUsers = (searchString)=>{
        console.log(tableSortingDetails)
        const {page,pageSize,order,orderBy} = tableSortingDetails
        var filter = {}
        if(searchString){
          if(!isNaN(searchString)){
            console.log("search string contains number only")
            filter = {
              searchString : parseInt(searchString),
              type : "phoneNumber"
            }
            
            getAdminUsers(page,pageSize,order,orderBy,filter)
          }else{
            console.log("search string contains letter")
            filter = {
              searchString : searchString,
              type : "email"
            }
            getAdminUsers(page,pageSize,order,orderBy,filter)
      
          }
        }
        
    }
    const edithandling = (selectedUser)=>{
        // const selectedObj = rows.find((item)=> item._id===selectedUser[0])
        // console.log(selectedObj)
        navigate(`/app/admin/users/edit/${selectedUser[0]}`)
  
    }
    const deletehandling = async (selectedUsers)=>{
      console.log(selectedUsers)
      try {
        setLoading(true)
        await AdminServices.deleteUsers(selectedUsers)
        enqueueSnackbar('User(s) deleted successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );
        setLoading(false)
        window.location.reload()
      } catch (error) {
        setLoading(false)
      }
    }
  
    const getAdminUsers = async (page=1,pageSize=5,order="desc",orderBy = "_id",filter={})=>{
      try{
          setRows([])
         
          //setTimeout(async () => {
            updateSearchCriteria({page,pageSize,order,orderBy})
            const offerdata = await AdminServices.getUsers(page,pageSize,order,orderBy,2,filter)
            setRows(offerdata.data.users)
            setCount(offerdata.data.count)
         // }, 2000);
         
         
          
      }catch(error){
          console.log(error)
          enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
  
          setRows([])
          setCount(0)
      }
    }
    
  // useEffect(()=>{
  //   getAdminUsers()
  // },[])
    return (
        <Container maxWidth={false}>
          <Toolbar searchHandler={searchUsers}/>
          <br/>
         <CustomTable 
                    rows={rows}
                    Headers = {Headers}
                    pageCount = {count}
                    getRows = {getAdminUsers}
                    editHandling={edithandling}
                    deleteHandling= {deletehandling}
                    Title = {tableTitle}
                />
       
        </Container>
    )
}


export default UserListView

