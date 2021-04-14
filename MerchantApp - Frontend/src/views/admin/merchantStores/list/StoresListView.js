import React from 'react'

import FilterToolbar from '../../CommonComponents/FilterToolbar'  
import CustomTable from '../../CommonComponents/CustTableComponent'
import useStores from '../../customHooks/useStores'
import {useNavigate} from 'react-router-dom'
 
const StoresListView = ({type}) =>{
  const [rows,count,getStores] = useStores()
  const navigate = useNavigate()
 
  const tableTitle ="Merchant Stores"
  const Headers = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Store Name', key : "name", type : "text",sort : true },
    { id: 'area', numeric: false, disablePadding: false, label: 'area', key : "area" , type : "text",sort : true},
    { id: 'city', numeric: false, disablePadding: false, label: 'city', key : "city" , type : "text",sort : false},
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' , key : "email", type : "text",sort : true},
    { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone Number', key : "phoneNumber", type : "text" ,sort : false},
    { id: 'isActive', numeric: false, disablePadding: false, label: 'Status' , key : "isActive", type : "active",sort : true},
    
  ]
  const getMerchantStores = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filter={})=>{
    const userType = window.sessionStorage.getItem("userType")
    getStores (page,pageSize,order,orderBy,searchCriteria,filter,userType)
  
  }
  const gotoDetails =(selectedRow)=>{
      console.log("view details....")
      if(type==="stores"){
        navigate(`/app/admin/merchant/stores/info/${selectedRow[0]}`)

      }else if(type==="storeImages"){
        navigate(`/app/admin/merchant/storeImages/${selectedRow[0]}`)

      }
  }
  
  return (
        <>
            <FilterToolbar 
            cityZipRequired = {true}
            handleFetchData = {getMerchantStores}
            />
            <br />
            <CustomTable 
                    rows={rows}
                    Headers = {Headers}
                    pageCount = {count}
                    getRows = {getMerchantStores}
                    tableToolbarOptions = {['view']}
                    viewHandling = {gotoDetails}
                    Title = {tableTitle}
                />
        </>
    )
}


export default StoresListView