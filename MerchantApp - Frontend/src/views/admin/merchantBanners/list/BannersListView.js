import React, { useContext, useEffect } from 'react'

import FilterToolbar from '../../CommonComponents/FilterToolbar'  
import CustomTable from '../../CommonComponents/CustTableComponent'
import useBanners from '../../customHooks/useBanners'
import {useNavigate} from 'react-router-dom'
 
const BannersListView = ({type}) =>{
  const [rows,count,getBanners] = useBanners()
  
  const navigate = useNavigate()
  const tableTitle ="Merchant Banners"
  const Headers = [
    { id: 'imagePath', numeric: false, disablePadding: true, label: 'Image', key : "imagePath", type : "text",sort : true },
    { id: 'isApproved', numeric: false, disablePadding: false, label: 'Status' , key : "isApproved", type : "active",sort : true},
    
  ]
  const getMerchantBanners = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filter={})=>{
    const userType = window.sessionStorage.getItem("userType")
    getBanners (page,pageSize,order,orderBy,searchCriteria,filter,userType)
  
  }
  const gotoDetails =(selectedRow)=>{
      console.log("view details....")
      navigate(`/app/admin/merchant/storeBanners/${selectedRow[0]}`)
      
  }
  return (
        <>
            <FilterToolbar 
            cityZipRequired = {true}
            handleFetchData = {getMerchantBanners}
           
            />
            <br />
            <CustomTable 
                    rows={rows}
                    Headers = {Headers}
                    pageCount = {count}
                    getRows = {getMerchantBanners}
                    tableToolbarOptions = {['view']}
                    viewHandling = {gotoDetails}
                    Title = {tableTitle}
                />
        </>
    )
}


export default BannersListView