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
    const [filterData,setFilterData] = useState({})
    const {setLoading} = useContext(GlobalContext);
    const {updateSearchCriteria,state} = useContext(UserManagemantContext)
    const {tableSortingDetails} = state
    const alertPosition = { horizontal: "right", vertical: "top" }
    const Headers = [
      { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name', key : "firstName", type : "text",sort : false },
      { id: 'LastName', numeric: false, disablePadding: false, label: 'Last Name', key : "lastName" , type : "text",sort : false},
      { id: 'email', numeric: false, disablePadding: false, label: 'Email' , key : "email", type : "text",sort : true},
      { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone Number', key : "phoneNumber", type : "text" ,sort : false},
      { id: 'isVerified', numeric: false, disablePadding: false, label: 'Status' , key : "status", type : "active",sort : true},
      { id: 'Action', numeric: false, disablePadding: false, label: 'Action' , key : "action", type : "action",sort : false,actionTypes:["edit"]}
    ]
    const tableTitle ="Admin Users"
    const searchUsers = async (searchString)=>{
        console.log(searchString)
        var filter = {}
        if(searchString){
          if(!isNaN(searchString)){
            console.log("search string contains number only")
            filter = {
              searchString : parseInt(searchString),
              type : "phoneNumber"
            }
            setFilterData(filter)
           // getAdminUsers(page,pageSize,order,orderBy,filter)
          }else{
            console.log("search string contains letter")
            filter = {
              searchString : searchString,
              type : "email"
            }
            setFilterData(filter)
           // getAdminUsers(page,pageSize,order,orderBy,filter)
          }
        }else{
          setFilterData(filter)
         // getAdminUsers(page,pageSize,order,orderBy,{})
        }
    }
    useEffect(()=>{
      const {page,pageSize,order,orderBy} = tableSortingDetails
      getAdminUsers(page,pageSize,order,orderBy,filterData)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[filterData])
    const edithandling = (selectedUser)=>{
        // const selectedObj = rows.find((item)=> item._id===selectedUser[0])
        // console.log(selectedObj)
        navigate(`/app/admin/users/edit/${selectedUser}`)
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
          if(Object.keys(filterData).length > 0 ){
            filter = filterData
          }          
          //setTimeout(async () => {
            updateSearchCriteria({page,pageSize,order,orderBy})
            const offerdata = await AdminServices.getUsers(page,pageSize,order,orderBy,2,filter)
            let resultData = offerdata.data.users
            if(offerdata.data.count === 0){
              resultData = [{error:-1, message : "Records not found..."}]
            }
            setRows(resultData)
            setCount(offerdata.data.count)
         // }, 2000);
      }catch(error){
          console.log(error)
          enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
  
          setRows([{error:-1, message : "Something went wrong, Please try again...!"}])
          setCount(0)
      }
    }
  // useEffect(()=>{
  //   getAdminUsers()
  // },[])
    return (
        <Container maxWidth={false}>
          <Toolbar />
          <br/>
         <CustomTable 
                    rows={rows}
                    Headers = {Headers}
                    pageCount = {count}
                    getRows = {getAdminUsers}
                    editHandling={edithandling}
                    deleteHandling= {deletehandling}
                    tableToolbarOptions = {['edit','delete']}
                    Title = {tableTitle}
                    searchHandler={searchUsers}
                    searchPlaceHolder = "Enter Email/Phone"
                />
        </Container>
    )
}
export default UserListView

