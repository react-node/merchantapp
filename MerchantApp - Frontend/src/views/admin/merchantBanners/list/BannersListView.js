import React from 'react'
import FilterToolbar from '../../CommonComponents/FilterToolbar'  
import CustomTable from '../../CommonComponents/CustTableComponent'
import useBanners from '../../customHooks/useBanners'
import {useNavigate} from 'react-router-dom'
 
const BannersListView = () =>{
  const [rows,count,getBanners,getMerchantBannersBySearch,errorMessage] = useBanners()
  const navigate = useNavigate()
  const tableTitle ="Merchant Banners"
  const Headers = [
    { id: 'imagePath', numeric: false, disablePadding: true, label: 'Image', key : "imagePath", type : "text",sort : true },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' , key : "status", type : "active",sort : true},
    { id: 'Action', numeric: false, disablePadding: false, label: 'Action' , key : "action", type : "action",sort : false,actionTypes:["view"]},
  ]
  const getMerchantBanners = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filter={})=>{
    const userType = window.sessionStorage.getItem("userType")
    getBanners (page,pageSize,order,orderBy,searchCriteria,filter,userType,false)
  }
  const gotoDetails =(selectedRow)=>{
      console.log("view details....")
      navigate(`/app/admin/merchant/storeBanners/${selectedRow}`)
  }
  const searchHandler = async (searchString)=>{
    console.log(searchString)
    getMerchantBannersBySearch(searchString)
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
                    searchHandler={searchHandler}
                    searchPlaceHolder = "Enter store name"
                    searchError = {errorMessage}
                />
        </>
    )
}
export default BannersListView