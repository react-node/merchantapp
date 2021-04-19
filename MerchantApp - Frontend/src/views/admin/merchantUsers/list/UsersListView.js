import React, { useState } from 'react'

import FilterToolbar from '../../CommonComponents/FilterToolbar'  
import CustomTable from '../../CommonComponents/CustTableComponent'
import useUsers from '../../customHooks/useUsers'
import {useNavigate} from 'react-router-dom'
 
const UsersListView = () =>{
  const [rows,count,getUsers] = useUsers()
  const [errorMessage,setErrorMessage] = useState("")
  const navigate = useNavigate()
  const [searchData,setSearchData] = useState({})

 
  const tableTitle ="Merchant Users"
  const Headers = [
    { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name', key : "firstName", type : "text",sort : false,actionTypes:[] },
    { id: 'LastName', numeric: false, disablePadding: false, label: 'Last Name', key : "lastName" , type : "text",sort : false,actionTypes:[]},
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' , key : "email", type : "text",sort : true,actionTypes:[]},
    { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone Number', key : "phoneNumber", type : "text" ,sort : false,actionTypes:[]},
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' , key : "status", type : "active",sort : true,actionTypes:[]},
    { id: 'Action', numeric: false, disablePadding: false, label: 'Action' , key : "action", type : "action",sort : false,actionTypes:["view"]},
    
  ]
  const getMerchantUsers = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filter={})=>{
    if(Object.keys(searchData).length > 0) searchCriteria = searchData
    getUsers (page,pageSize,order,orderBy,searchCriteria,filter,3)
  
  }
  const gotoDetails =(selectedRow)=>{
      console.log("view details....")
      navigate(`/app/admin/merchant/users/info/${selectedRow}`)
  }
  const getMerchantUsersBySearch = async (searchString)=>{
    console.log(searchString)
    var searchCriteria = {}
    if(searchString){
      if(!isNaN(searchString)){
        console.log("search string contains number only")
        searchCriteria = {
          searchString : parseInt(searchString),
          type : "phoneNumber"
        }
        setSearchData(searchCriteria)
        if(searchString.length === 10){
          setErrorMessage("")
          getUsers(1,5,"desc","_id",searchCriteria,{})
        }else{
          setErrorMessage("Please enter valid Phone number")

        }
       // getAdminUsers(page,pageSize,order,orderBy,filter)
      }else{
        setErrorMessage("")
        console.log("search string contains letter")
        searchCriteria = {
          searchString : searchString,
          type : "email"
        }
        setSearchData(searchCriteria)

        getUsers(1,5,"desc","_id",searchCriteria,{})

       // getAdminUsers(page,pageSize,order,orderBy,filter)
  
      }
    }else{
      setErrorMessage("")
      setSearchData(searchCriteria)

      getUsers(1,5,"desc","_id",searchCriteria,{})

     // getAdminUsers(page,pageSize,order,orderBy,{})
    }

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
                    searchHandler={getMerchantUsersBySearch}
                    searchPlaceHolder = "Enter Email/Phone"
                    searchError = {errorMessage}
                />
        </>
    )
}


export default UsersListView