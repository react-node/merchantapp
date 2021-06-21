import { useContext } from "react"
import { Context as GlobalContext } from '../globalContext/globalContext'
import {API_URI,CUSTOMER_AUTH,CUST_FORGOT_PASSWORD} from '../utils/config';
import useServiceCalls from './useServiceCalls'
import {  useSnackbar } from 'notistack';

const useLogin = ()=>{
  const {setLoginModel,setAccessToken} = useContext(GlobalContext)
  const {post} = useServiceCalls()
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  
    //const [open, setOpen] = React.useState(loginModel);

    const handleClickOpen = () => {
        console.log("click open...")
        setLoginModel(true);
    };
  
    const handleClose = () => {
      setLoginModel(false);
    };
    const handleFormSubmit = async (data)=>{
      try{
        const url = `${API_URI}${CUSTOMER_AUTH}`
        const result = await post(url,data,false)
        if(result.data.isNewUser) {
          enqueueSnackbar('Email sent to you registered address.Please verify to activate your account...!',   { variant: "success","anchorOrigin" : alertPosition } );

        }else{
          setAccessToken(result.data.accessToken)
        }

        
        handleClose()
        console.log(result)
      }catch(error){
        console.log(error)
        if (error.response) {
          // client received an error response (5xx, 4xx)
          if(error.response.status === 401){
            enqueueSnackbar('Invalid password...!',   { variant: "error","anchorOrigin" : alertPosition } );
          }
          if(error.response.status === 406){
            enqueueSnackbar('Please verify your account...!',   { variant: "error","anchorOrigin" : alertPosition } );
          }
        
        } 
        throw error
      }
     

    }
    const sendForgotpasswordLink = async (data)=>{
      try{
        const url = `${API_URI}${CUST_FORGOT_PASSWORD}`
        const result = await post(url,data,false)
        enqueueSnackbar('Email sent to you registered address.',   { variant: "success","anchorOrigin" : alertPosition } );
        
        handleClose()
        console.log(result)
      }catch(error){
        console.log(error)
        if (error.response) {
          // client received an error response (5xx, 4xx)
          if(error.response.status === 404){
            enqueueSnackbar('Please enter registered email address...!',   { variant: "error","anchorOrigin" : alertPosition } );
          }
          if(error.response.status === 406){
            enqueueSnackbar('Please verify your account...!',   { variant: "error","anchorOrigin" : alertPosition } );
          }
        
        } 
        throw error
      }
     

    }
    return [handleClickOpen,handleClose,handleFormSubmit,sendForgotpasswordLink]
}

export default useLogin