import { useReducer, useState } from 'react'
import {useParams} from 'react-router-dom'
import useServices from './useServices'
import * as config from '../../../utils/config';
import { useSnackbar } from 'notistack';
import {useNavigate} from 'react-router-dom'
const useAsyncState=(initialValue)=> {
    const [value, setValue] = useState(initialValue);
    const setter = x =>
      new Promise(resolve => {
        setValue(x);
        resolve(x);
      });
    return [value, setter];
  }
const initialState = {storeImages:[],isResponseEmpty : true}
const userReducer = (state,action) =>{
    switch(action.type){
        case "SET_STORE_IMAGES_DATA" : 
        return {...state,storeImages:[...state.storeImages,...action.payload]}
        case "RESET_STORE_IMAGES_DATA" : 
        return {...state,storeImages:[...action.payload]}
        case "SET_IS_RESPONSE_EMPTY" : 
        return {...state,isResponseEmpty:action.payload}
        default:
            return state
    }
}
const useGetStoreImages = ()=>{
    const {storeID} = useParams()
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    console.log("custom hook to get the data...",storeID)
    const [isResponseEmpty, setisResponseEmpty]  = useAsyncState(true)
    const [state,dispatch] = useReducer(userReducer,initialState)
    const {get,put} = useServices()
    const navigate = useNavigate()
    const getStatusCode = (filterStatus)=>{
        switch (filterStatus) {
            case "Submitted" : return 1;
            case "Approved" : return 2;
            case "Rejected" : return 3;
            default : return 0;
        }
    }
    const getStoreImagesInfo = async (page=1,filterStatus="All",isStatusChange=false)=>{
        try {
            if(isStatusChange && (filterStatus==='null' || filterStatus !== "All") ){
                await setisResponseEmpty(true)
                .then(async (isResponseEmpty)=>{
                    console.log("in callback=======",isResponseEmpty)
                    await getStoreImagesData(page,filterStatus,isStatusChange,isResponseEmpty)
                })
                // await dispatch({
                //     type:"SET_IS_RESPONSE_EMPTY",
                //     payload : true
                // })
                // dispatch({
                //     type:"RESET_STORE_IMAGES_DATA",
                //     payload : []
                // })
            }else{
                await getStoreImagesData(page,filterStatus,isStatusChange,isResponseEmpty)
            }
           
        } catch (error) {
            console.log(error)
          
        }

    }
    const updateStoreImageStatus = async (selectedImages,status=0,rejectedMessage="") =>{
        try {
            console.log("custom hook update status function...",status,rejectedMessage)
            //const response = await AdminServices.getUserByID()
            const URL = `${config.API_URI}${config.STORE_IMAGE_DB}/${storeID}`
            

                let requestData ={
                        selectedIds : selectedImages,
                        status,
                        isApproved : status===2 ? true : false,
                        rejectedMessage
                    }
               

            console.log(requestData)
            await put(URL,requestData)
            enqueueSnackbar('Updated Successfully',   { variant: "success","anchorOrigin" : alertPosition } );
            navigate('/app/admin/merchant/storeImages')
          
        } catch (error) {
            console.log(error)
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

        }
    }

    // useEffect(()=>{
    //     getStoreImagesInfo()
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[])
    // useEffect(()=>{
    //     getStoreImagesData()
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[state.isResponseEmpty])
    const getStoreImagesData =  async (page, filterStatus,isStatusChange,isResponseEmpty)=>{
        try {
            console.log("get func%%%%%%%%%%%%%%%%%%%%%%%%")
            if(storeID && isResponseEmpty){
               
            console.log("custom hook get store images function...",storeID)
           // const response = await AdminServices.getUserByID(id,3)
           const userType = window.sessionStorage.getItem("userType")
           let statusCode = getStatusCode(filterStatus)
           const URL = config.API_URI+config.STORE_IMAGE_DB+`/${storeID}?type=${userType}&page=${page}&status=${statusCode}`
           
           const response = await get(URL)
           if(isStatusChange && (filterStatus==='null' || filterStatus !== "All") ){
            dispatch({
                    type:"RESET_STORE_IMAGES_DATA",
                    payload : response.data
                })
           }else{
            dispatch({
                type:"SET_STORE_IMAGES_DATA",
                payload : response.data
            })
           }
            
           
            if(response.data.length ===0){
                 setisResponseEmpty(false)
                // dispatch({
                //     type:"SET_IS_RESPONSE_EMPTY",
                //     payload : false
                // })
            }
        }
        } catch (error) {
            console.log(error)
          
        }
    }

    return [state.storeImages,updateStoreImageStatus,getStoreImagesInfo]



}
export default useGetStoreImages