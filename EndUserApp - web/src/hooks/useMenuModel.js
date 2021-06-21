import { useContext } from "react"
import { Context as GlobalContext } from '../globalContext/globalContext'
import {API_URI,CUSTOMER_AUTH,CUST_FORGOT_PASSWORD} from '../utils/config';
import useServiceCalls from './useServiceCalls'
import {  useSnackbar } from 'notistack';

const useMenuModel = ()=>{
  const {setMenuModel,setAccessToken} = useContext(GlobalContext)
  const {post} = useServiceCalls()
  const { enqueueSnackbar } = useSnackbar();
  const alertPosition = { horizontal: "right", vertical: "top" }
  
    //const [open, setOpen] = React.useState(loginModel);

    const handleClickOpen = () => {
        console.log("click open...")
        setMenuModel(true);
    };
  
    const handleClose = () => {
        setMenuModel(false);
    };

    return [handleClickOpen,handleClose]
}

export default useMenuModel