import { useContext, useState } from 'react'
import { useSnackbar } from 'notistack'
import { Context as UserManagemantContext } from '../userManagement/Context/userManagementContext';
import * as config from '../../../utils/config'
import useServices from './useServices'
import moment from 'moment';
const useDashboard = () =>{
    const [rows,setRows] = useState([])
    
    const {get} = useServices()
    const [count,setCount] = useState(0)
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    
    console.log("custom hook get all banners data.....")
    const getDashboardData = async ()=>{
        try{
            setRows([])
            
            const URL = config.API_URI+config.GET_ADMIN_DASHBOARD
            //const offerdata = await AdminServices.getUsers(page,pageSize,order,orderBy,userType,searchCriteria,filter)
            const response = await get(URL)
            let resultData = response.data
           
            setRows(resultData)
            setCount(response.data.count)
        }catch(error){
            console.log(error)
            setRows([{error:-1, message : "Something went wrong, Please try again...!"}])
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
            setCount(0)
        }
      }
      
      return [rows,getDashboardData]
}

export default useDashboard