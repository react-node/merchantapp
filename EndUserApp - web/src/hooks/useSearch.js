import { useContext } from "react"
import { Context as GlobalContext } from '../globalContext/globalContext'
import {API_URI,CUSTOMER_AUTH,CUST_FORGOT_PASSWORD} from '../utils/config';
import useServiceCalls from './useServiceCalls'
import {  useSnackbar } from 'notistack';

const useSearch = ()=>{
  const {setSearchModel,setAccessToken} = useContext(GlobalContext)
  const {post} = useServiceCalls()
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  
    //const [open, setOpen] = React.useState(loginModel);

    const handleClickOpen = () => {
        console.log("click open...")
        setSearchModel(true);
    };
  
    const handleClose = () => {
        setSearchModel(false);
    };

    return [handleClickOpen,handleClose]
}

export default useSearch