import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import MyLocationIcon from '@material-ui/icons/MyLocation';
import { usePlacesWidget } from "react-google-autocomplete";
import {GOOGLE_MAP_API_KEY} from '../../utils/config'
import MapServices from 'src/services/MapServices';
import { Context as GlobalContext } from '../../globalContext/globalContext'
import useGetLocation from 'src/hooks/useGetLocation';
import Geocode from "react-geocode";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function LocationSearchBar({handleClose}) {
  const classes = useStyles();
  const {setUserLocation} = useContext(GlobalContext)
  //const {userLocation} = state
  const {readLocation,getPopularAreas} = useGetLocation()
  Geocode.setApiKey(GOOGLE_MAP_API_KEY)

  const { ref } = usePlacesWidget({
    apiKey: GOOGLE_MAP_API_KEY,
    onPlaceSelected: (place) => {
      console.log(place)
    const lat = place.geometry.location.lat(),
     lng = place.geometry.location.lng();
    // setUserLocation({lat,lng,zipcode,location:`${area}, ${city}`})
    // console.log(area,city,lat,lng,zipcode)
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
          location:`${area}, ${city}`})
          getPopularAreas(city)
      },

      (error) => {
      console.error(error);
      }
    );
   // getPopularAreas(city)

     handleClose()
    },
    options: {types : []}
  })
  const getCurrentLocation=()=>{
    readLocation()
    handleClose()
  }
  return (
    <Paper component="form" className={classes.root}>
      {/* <Autocomplete
        apiKey={GOOGLE_MAP_API_KEY}
        onPlaceSelected={(place) => console.log(place)}
        types={[]}
      /> */}
      <InputBase
        inputRef={ref} 
        className={classes.input}
        placeholder="Enter area / city / zipcode"
        inputProps={{ 'aria-label': 'Enter area / city / zipcode' }}
      />
      
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={getCurrentLocation}>
        <MyLocationIcon />
      </IconButton>
    </Paper>
  );
}
