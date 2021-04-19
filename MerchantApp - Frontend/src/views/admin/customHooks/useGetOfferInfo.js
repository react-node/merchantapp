import { useEffect, useReducer } from 'react'
import {useParams} from 'react-router-dom'
import useServices from './useServices'
import * as config from '../../../utils/config';
import { useSnackbar } from 'notistack';
import {useNavigate} from 'react-router-dom'

const initialState = {offerData:{}}
const userReducer = (state,action) =>{
    switch(action.type){
        case "SET_OFFERS_DATA" : 
        return {...state,offerData:action.payload}
        default:
            return state

    }
}
const useGetOfferInfo = ()=>{
    const {offerID} = useParams()
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    console.log("custom hook to get the data...",offerID)
    const [state,dispatch] = useReducer(userReducer,initialState)
    const {get,put} = useServices()
    const navigate = useNavigate()

    const getOfferInfo = async (id)=>{
        try {
            console.log("custom hook get function...",id)
           // const response = await AdminServices.getUserByID(id,3)
           const URL = config.API_URI+config.OFFERS+`/${id}`
            const response = await get(URL)
            dispatch({
                type:"SET_OFFERS_DATA",
                payload : response.data
            })
        } catch (error) {
            console.log(error)
        }

    }
    const updateOfferStatus = async (_id,status=0,rejectedMessage="") =>{
        try {
            console.log("custom hook update status function...",status,rejectedMessage)
            //const response = await AdminServices.getUserByID()
            const URL = `${config.API_URI}${config.OFFERS}/${_id}`
            const requestBody = {
                status,
                isActive : status===2 ? true : false,
                rejectedMessage
            }
            await put(URL,requestBody)
            enqueueSnackbar('Updated Successfully',   { variant: "success","anchorOrigin" : alertPosition } );
            navigate('/app/admin/merchant/storeOffers')
          
        } catch (error) {
            console.log(error)
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

        }
    }

    useEffect(()=>{
        getOfferInfo(offerID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return [state.offerData,updateOfferStatus]



}
export default useGetOfferInfo