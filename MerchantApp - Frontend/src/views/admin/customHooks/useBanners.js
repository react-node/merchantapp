import { useContext, useState } from 'react'
import { useSnackbar } from 'notistack'
import AdminServices from 'src/services/AdminServices';
import { Context as UserManagemantContext } from '../userManagement/Context/userManagementContext';
import * as config from '../../../utils/config'
import useServices from './useServices'
import moment from 'moment';
const useBanners = () =>{
    const [rows,setRows] = useState([])
    const [filterData,setFilterData] = useState({})
    const {get} = useServices()
    const [count,setCount] = useState(0)
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    const {updateSearchCriteria} = useContext(UserManagemantContext)
    console.log("custom hook get all banners data.....")
    const getBanners = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filterOptions={},userType=0)=>{
        try{
            setRows([])
            
            if(Object.keys(filterOptions).length === 0){
              //  filterOptions = filterData
                filterOptions = JSON.parse(localStorage.getItem("contextFilterData") || JSON.stringify(filterData) )

            }else{
                setFilterData(filterOptions)
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
                    filter += `&field=${searchCriteria.type}&val=${searchCriteria.searchString}`
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
            
              const URL = config.API_URI+config.BANNER__BY_ZIPCODE+filter
              //const offerdata = await AdminServices.getUsers(page,pageSize,order,orderBy,userType,searchCriteria,filter)
              const response = await get(URL)
              let resultData = response.data.bannerImages
              resultData.map(item=>item.imagePath = item.imagePath.split("/")[1])
              if(response.data.count === 0){
                resultData = [{error:-1, message : "Records not found..."}]
              }
              setRows(resultData)
              setCount(response.data.count)
           
            
        }catch(error){
            console.log(error)
            setRows([{error:-1, message : "Something went wrong, Please try again...!"}])
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
    
           // setRows([])
            setCount(0)
        }
      }
      return [rows,count,getBanners]
}

export default useBanners