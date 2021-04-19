import { useContext, useState } from 'react'
import { useSnackbar } from 'notistack'
import { Context as UserManagemantContext } from '../userManagement/Context/userManagementContext';
import * as config from '../../../utils/config'
import useServices from './useServices'
import moment from 'moment';

const useStores = () =>{
    const [rows,setRows] = useState([])
    const [filterData,setFilterData] = useState({})
    const [searchData,setSearchData] = useState({})
    const [errorMessage,setErrorMessage] = useState("")
    const {get} = useServices()
    const [count,setCount] = useState(0)
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    const {updateSearchCriteria} = useContext(UserManagemantContext)
    console.log("custom hook get all stores data.....")
    const getStores = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filterOptions={},userType=0,isItSearch=false)=>{
        try{
            setRows([])
            if(Object.keys(filterOptions).length === 0){
                //filterOptions = filterData
                filterOptions = JSON.parse(localStorage.getItem("contextFilterData") || JSON.stringify(filterData) )
            }else{
                setFilterData(filterOptions)
            }
            if(!isItSearch){
                if(Object.keys(searchData).length > 0) searchCriteria = searchData
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
            const URL = config.API_URI+config.STORES+filter
            //const offerdata = await AdminServices.getUsers(page,pageSize,order,orderBy,userType,searchCriteria,filter)
            const offerdata = await get(URL)
            let resultData = offerdata.data.storesData
            if(offerdata.data.count === 0){
              resultData = [{error:-1, message : "Records not found..."}]
            }
            setRows(resultData)
            setCount(offerdata.data.count)
        }catch(error){
            console.log(error)
            setRows([{error:-1, message : "Something went wrong, Please try again...!"}])
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
            setCount(0)
        }
      }
      const getMerchantStoresBySearch = async (searchString)=>{
        console.log(searchString)
        const userType = window.sessionStorage.getItem("userType")
        var searchCriteria = {}
        if(searchString){
          if(!isNaN(searchString)){
            console.log("search string contains number only")
            searchCriteria = {
              searchString : parseInt(searchString),
              type : "zipcode"
            }
            setSearchData(searchCriteria)
            if(searchString.length === 6){
              setErrorMessage("")
              getStores(1,5,"desc","_id",searchCriteria,{},userType,true)
            }else{
              setErrorMessage("Please enter valid zipcode")
    
            }
           // getAdminUsers(page,pageSize,order,orderBy,filter)
          }else{
            setErrorMessage("")
            console.log("search string contains letter")
            searchCriteria = {
              searchString : searchString,
              type : "name"
            }
            setSearchData(searchCriteria)
            getStores(1,5,"desc","_id",searchCriteria,{},userType,true)
          }
        }else{
          setErrorMessage("")
          setSearchData(searchCriteria)
          getStores(1,5,"desc","_id",searchCriteria,{},userType,true)
        }
      }
    //   useEffect(()=>{
    //     //if(Object.keys(searchData).length === 0) return  
    //     if(searchData.type === "phoneNumber"){
    //         if(searchData.searchString.toString().length === 10){
    //               setErrorMessage("")
    //             }else{
    //               setErrorMessage("Please enter valid Phone number")
    //               return
    //             }
    //     }
    //     const userType = window.sessionStorage.getItem("userType")

    //     getStores(1,5,"desc","_id",searchData,{},userType)

    //   },[searchData])  
      return [rows,count,getStores,getMerchantStoresBySearch,errorMessage]
}
export default useStores