import React from 'react'

import FilterToolbar from '../../CommonComponents/FilterToolbar'  
import CustomTable from '../../CommonComponents/CustTableComponent'
import useOffers from '../../customHooks/useOffers'
import {useNavigate} from 'react-router-dom'
 
const OffersListView = () =>{
  const [rows,count,getOffers,getMerchantOffersBySearch,errorMessage] = useOffers()
  const navigate = useNavigate()
  const tableTitle ="Merchant Offers"
  const Headers = [
    { id: 'offerName', numeric: false, disablePadding: true, label: 'Offer Name', key : "offerName", type : "text",sort : true },
    { id: 'offerDescription', numeric: false, disablePadding: false, label: 'Offer Desc', key : "offerDescription", type : "text",sort : false },
    { id: 'discountType', numeric: false, disablePadding: false, label: 'Discount Type', key : "discountType", type : "text",sort : false },
    { id: 'discount', numeric: false, disablePadding: false, label: 'Discount', key : "discount", type : "text",sort : false },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' , key : "status", type : "active",sort : true},
    { id: 'Action', numeric: false, disablePadding: false, label: 'Action' , key : "action", type : "action",sort : false,actionTypes:["view"]},
  ]
  const getMerchantOffers = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filter={})=>{
    const userType = window.sessionStorage.getItem("userType")
    getOffers (page,pageSize,order,orderBy,searchCriteria,filter,userType,false)
  }
  const gotoDetails =(selectedRow)=>{
      console.log("view details....")
      navigate(`/app/admin/merchant/storeOffers/${selectedRow}`)
  }
  const searchHandler = async (searchString)=>{
    console.log(searchString)
    getMerchantOffersBySearch(searchString)
  }
  return (
        <>
            <FilterToolbar 
            cityZipRequired = {true}
            handleFetchData = {getMerchantOffers}
            />
            <br />
            <CustomTable 
                    rows={rows}
                    Headers = {Headers}
                    pageCount = {count}
                    getRows = {getMerchantOffers}
                    tableToolbarOptions = {['view']}
                    viewHandling = {gotoDetails}
                    Title = {tableTitle}
                    searchHandler={searchHandler}
                    searchPlaceHolder = "Enter store name"
                    searchError = {errorMessage}
                />
        </>
    )
}
export default OffersListView