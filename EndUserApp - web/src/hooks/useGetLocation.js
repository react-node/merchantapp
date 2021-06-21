import { useContext, useEffect, useState } from 'react'
import Geocode from "react-geocode";
import  * as config from '../utils/config'
import MapServices from '../services/MapServices'
import {Context as GlobalContext} from '../../src/globalContext/globalContext'
import useServiceCalls from './useServiceCalls'

const useGetLocation=()=>{
   // const [location, setLocation] = useState({});
    const [error, setError] = useState('');
    const {setUserLocation,setPopularAreas,getUserLocation} = useContext(GlobalContext)
    const userLocation = getUserLocation() || {}
    const {get} = useServiceCalls()
    //const [accuracy, setAccuracy] = useState(0);
    Geocode.setApiKey(config.GOOGLE_MAP_API_KEY)
    const readLocation = () => {
      if (navigator.geolocation) {
        const geoId = navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // setLocation({ lat, lng ,
            //     accuracy: position.coords.accuracy});
            //setAccuracy(position.coords.accuracy);
            // Get address from latitude & longitude.
            Geocode.fromLatLng(lat, lng).then(
                (response) => {
                //const address = response.results[0].formatted_address,
                const addressArray =  response.results[0].address_components,
                 zipcode = MapServices.getPostalCode( addressArray ),
                city = MapServices.getCity( addressArray ),
                area = MapServices.getArea( addressArray );
                // setLocation({ lat, lng ,
                //     accuracy: position.coords.accuracy,location:`${area}, ${city}`});
                console.log(area,city);
                setUserLocation({ lat, lng ,zipcode,
                    accuracy: position.coords.accuracy,location:`${area}, ${city}`})
                    getPopularAreas(city)
                },

                (error) => {
                console.error(error);
                }
            );
            console.log({ lat, lng }, position.coords.accuracy);
            if (position.coords.accuracy > 10) {
              console.log("The GPS accuracy isn't good enough");
            }
          },
          (e) => {
            console.log(e.message);
            setError(e.message);
          },
          { enableHighAccuracy: true, }
        );
        return () => {
          console.log('Clear watch called');
          window.navigator.geolocation.clearWatch(geoId);
        };
      }
    
      return;
    };
    //get popular areas in city
    const getPopularAreas=async (city)=>{
        console.log(city)
        const url=`${config.API_URI}${config.CITY_ZIPCODES}?cities=${city}`
        const response = await get(url)
        var popularAreas = []
        if(response.data.length>0){
            popularAreas=response.data[0].popularAreas
        }

        setPopularAreas(popularAreas)
        

    }
    useEffect(()=>{
        if(Object.keys(userLocation).length===0)
            readLocation()
            // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return {readLocation,error,getPopularAreas}
}

export default useGetLocation