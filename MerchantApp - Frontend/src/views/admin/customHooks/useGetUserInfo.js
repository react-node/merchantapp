import { useEffect, useReducer } from 'react'
import {useParams} from 'react-router-dom'
import useServices from './useServices'
import * as config from '../../../utils/config';
import { useSnackbar } from 'notistack';
import {useNavigate} from 'react-router-dom'

const initialState = {userData:{}}
const userReducer = (state,action) =>{
    switch(action.type){
        case "SET_USER_DATA" : 
        return {...state,userData:action.payload}
        default:
            return state

    }
}
const useGetUserInfo = ()=>{
    const {id} = useParams()
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    console.log("custom hook to get the data...",id)
    const [state,dispatch] = useReducer(userReducer,initialState)
    const {get,put} = useServices()
    const navigate = useNavigate()

    const getUserInfo = async (id)=>{
        try {
            console.log("custom hook get function...",id)
           // const response = await AdminServices.getUserByID(id,3)
           const URL = config.API_URI+config.GET_USER+`/3/${id}`
            const response = await get(URL)
            dispatch({
                type:"SET_USER_DATA",
                payload : response.data
            })
        } catch (error) {
            console.log(error)
        }

    }
    const updateUserStatus = async (_id,status=0,rejectedMessage="") =>{
        try {
            console.log("custom hook update status function...",status,rejectedMessage)
            //const response = await AdminServices.getUserByID()
            const URL = `${config.API_URI}${config.PROFILE}`
            const requestBody = {
                editId : _id,
                status,
                rejectedMessage
            }
            await put(URL,requestBody)
            enqueueSnackbar('Updated Successfully',   { variant: "success","anchorOrigin" : alertPosition } );
            navigate('/app/admin/merchant/users')
          
        } catch (error) {
            console.log(error)
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

        }
    }

    useEffect(()=>{
        getUserInfo(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return [state.userData,updateUserStatus]



}
export default useGetUserInfo