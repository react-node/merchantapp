import { useContext, useState } from 'react'
import { useSnackbar } from 'notistack'
import { Context as UserManagemantContext } from '../userManagement/Context/userManagementContext';
import * as config from '../../../utils/config'
import useServices from './useServices'
import moment from 'moment';
const useOffers = () =>{
    const [rows,setRows] = useState([])
    const [filterData,setFilterData] = useState({})
    const [searchData,setSearchData] = useState({})
    const [errorMessage,setErrorMessage] = useState("")
    const {get} = useServices()
    const [count,setCount] = useState(0)
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    const {updateSearchCriteria} = useContext(UserManagemantContext)
    console.log("custom hook get all offers data.....")
    const getOffers = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filterOptions={},userType=0,isItSearch=false)=>{
        try{
            setRows([])
            if(Object.keys(filterOptions).length === 0){
              //  filterOptions = filterData
                filterOptions = JSON.parse(localStorage.getItem("contextFilterData") || JSON.stringify(filterData) )
            }else{
                setFilterData(filterOptions)
            }
            if(!isItSearch){
                if(Object.keys(searchData).length > 0) searchCriteria = searchData
            }
            if(Object.keys(filterOptions).length === 0 || filterOptions.zipcode.length === 0){
                let initData = [{error:-1, message : "please select city and zipcodes to fetch the data...."}]
                setRows(initData)
                setCount(0)
                return false
            }
            updateSearchCriteria({page,pageSize,order,orderBy})
            let filter =`?pagesize=${pageSize}&page=${page}&orderBy=${orderBy}&order=${order}&userType=${userType}`
            if(Object.keys(searchCriteria).length >0 )
                filter += `&type=${searchCriteria.type}&searchstring=${searchCriteria.searchString}`
            if(Object.keys(filterOptions).length >0 )   {
                if(filterOptions.fromDate){
                    const fromDate = moment(filterOptions.fromDate).format('YYYY-MM-DD')
                    filter += `&fromDate=${fromDate}`
                }
                if(filterOptions.toDate){
                    const toDate = moment(filterOptions.toDate).format('YYYY-MM-DD')
                    filter += `&toDate=${toDate}`
                }
                if(filterOptions.status) {
                    var status=0
                    if(filterOptions.status === "Submitted"){
                        status=1
                    }else if(filterOptions.status === "Approved"){
                        status=2
                    }else if(filterOptions.status === "Rejected"){
                        status=3
                    }
                    filter += `&status=${status}`
                }
                if(filterOptions.zipcode.length > 0){
                    filter += `&zipcodes=${filterOptions.zipcode.toString()}`
                }
            }
            const URL = config.API_URI+config.GET_OFFERS_BY_ZIPCODES+filter
            //const offerdata = await AdminServices.getUsers(page,pageSize,order,orderBy,userType,searchCriteria,filter)
            const response = await get(URL)
            let resultData = response.data.offersData
            if(response.data.count === 0){
              resultData = [{error:-1, message : "Records not found..."}]
            }
            setRows(resultData)
            setCount(response.data.count)
        }catch(error){
            console.log(error)
            setRows([{error:-1, message : "Something went wrong, Please try again...!"}])
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
            setCount(0)
        }
      }
      const getMerchantOffersBySearch = async (searchString)=>{
        console.log(searchString)
        const userType = window.sessionStorage.getItem("userType")
        var searchCriteria = {}
        if(searchString){
          if(!isNaN(searchString)){
            console.log("search string contains number only")
            searchCriteria = {
              searchString : parseInt(searchString),
              type : "number"
            }

            setSearchData(searchCriteria)
           
            setErrorMessage("Please enter valid store name")
    
           // getAdminUsers(page,pageSize,order,orderBy,filter)
          }else{
            setErrorMessage("")
            console.log("search string contains letter")
            searchCriteria = {
              searchString : searchString,
              type : "string"
            }
            setSearchData(searchCriteria)
            getOffers(1,5,"desc","_id",searchCriteria,{},userType,true)
          }
        }else{
          setErrorMessage("")
          setSearchData(searchCriteria)
          getOffers(1,5,"desc","_id",searchCriteria,{},userType,true)
        }
    
      }
      return [rows,count,getOffers,getMerchantOffersBySearch,errorMessage]
}

export default useOffers