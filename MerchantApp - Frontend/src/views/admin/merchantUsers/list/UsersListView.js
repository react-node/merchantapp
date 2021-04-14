import React from 'react'

import FilterToolbar from '../../CommonComponents/FilterToolbar'  
import CustomTable from '../../CommonComponents/CustTableComponent'
import useUsers from '../../customHooks/useUsers'
import {useNavigate} from 'react-router-dom'
 
const UsersListView = () =>{
  const [rows,count,getUsers] = useUsers()
  const navigate = useNavigate()
 
  const tableTitle ="Merchant Users"
  const Headers = [
    { id: 'firstName', numeric: false, disablePadding: true, label: 'First Name', key : "firstName", type : "text",sort : false },
    { id: 'LastName', numeric: false, disablePadding: false, label: 'Last Name', key : "lastName" , type : "text",sort : false},
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' , key : "email", type : "text",sort : true},
    { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone Number', key : "phoneNumber", type : "text" ,sort : false},
    { id: 'isVerified', numeric: false, disablePadding: false, label: 'Status' , key : "isVerified", type : "active",sort : true},
    
  ]
  const getMerchantUsers = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filter={})=>{
    
    getUsers (page,pageSize,order,orderBy,searchCriteria,filter,3)
  
  }
  const gotoDetails =(selectedRow)=>{
      console.log("view details....")
      navigate(`/app/admin/merchant/users/info/${selectedRow[0]}`)
  }
  
  return (
        <>
            <FilterToolbar 
            cityZipRequired = {false}
            handleFetchData = {getMerchantUsers}
            />
            <br />
            <CustomTable 
                    rows={rows}
                    Headers = {Headers}
                    pageCount = {count}
                    getRows = {getMerchantUsers}
                    tableToolbarOptions = {['view']}
                    viewHandling = {gotoDetails}
                    Title = {tableTitle}
                />
        </>
    )
}


export default UsersListView