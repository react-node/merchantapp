import { useContext } from 'react';
import {Context as GlobalContext} from '../globalContext/globalContext'


const useLocationData = ()=>{
  
    const {getUserLocation} = useContext(GlobalContext)
    const userDetails = getUserLocation() || {}


    return {
        lat : userDetails.lat,
        lng : userDetails.lng,
        location : userDetails.location,
        zipcode :userDetails.zipcode,
    }


}

export default useLocationData