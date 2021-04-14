import { useEffect, useReducer } from 'react'
import {useParams} from 'react-router-dom'
import useServices from './useServices'
import * as config from '../../../utils/config';
import { useSnackbar } from 'notistack';
import {useNavigate} from 'react-router-dom'

const initialState = {storeData:{}}
const userReducer = (state,action) =>{
    switch(action.type){
        case "SET_STORE_DATA" : 
        return {...state,storeData:action.payload}
        default:
            return state

    }
}
const useGetStoreInfo = ()=>{
    const {storeID} = useParams()
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    console.log("custom hook to get the data...",storeID)
    const [state,dispatch] = useReducer(userReducer,initialState)
    const {get,put} = useServices()
    const navigate = useNavigate()

    const getUserInfo = async (id)=>{
        try {
            console.log("custom hook get function...",id)
           // const response = await AdminServices.getUserByID(id,3)
           const URL = config.API_URI+config.STORES+`/${id}`
            const response = await get(URL)
            dispatch({
                type:"SET_STORE_DATA",
                payload : response.data
            })
        } catch (error) {
            console.log(error)
        }

    }
    const updateStoreStatus = async (_id,status=0,rejectedMessage="") =>{
        try {
            console.log("custom hook update status function...",status,rejectedMessage)
            //const response = await AdminServices.getUserByID()
            const URL = `${config.API_URI}${config.STORES}`
            const requestBody = {
                _id,
                status,
                isActive : status===2 ? true : false,
                rejectedMessage
            }
            await put(URL,requestBody)
            enqueueSnackbar('Updated Successfully',   { variant: "success","anchorOrigin" : alertPosition } );
            navigate('/app/admin/merchant/stores')
          
        } catch (error) {
            console.log(error)
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

        }
    }

    useEffect(()=>{
        getUserInfo(storeID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return [state.storeData,updateStoreStatus]



}
export default useGetStoreInfo