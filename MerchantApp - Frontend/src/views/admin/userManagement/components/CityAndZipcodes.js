import {  colors, FormHelperText, Grid, makeStyles, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';
import { result } from 'lodash';
import React, { useEffect, useState } from 'react'
import AdminServices from 'src/services/AdminServices';
import theme from 'src/theme';

const useStyles = makeStyles(()=>({
    root:{},
    errorInputLable : {
        color : colors.red[400]
    }
}))

const CityAndZipcodes =({value,onHandleCityChange,onHandleZipcodeChange,zipcodeValue,touched,errors})=>{
    const classes = useStyles();
   // const [cities,setCities] = useState([])
    const [cityAndZipcodes,setcityAndZipcodes] = useState([])
    const [zipcodes,setZipcodes] = useState([])
    const [cities,setCities] = useState([])
   
    const getCityAndZipcodes =async ()=>{
        try {
          const resultData = await AdminServices.getCityAndZipcodes()

          setcityAndZipcodes(resultData.data)
          let c=[]
          resultData.data.forEach((i)=>{

            c.push(i.city)

          })
          setCities(c)
         // let c= []

        //   resultData.data.forEach((item)=>{
        //       c.push(item.city)
              
        //   })
        
          
         // setCities(c)
          
        } catch (error) {
         
        }
    }
    const filterZipcodes = (selectedCity) =>{
        console.log(selectedCity)
        let newzipcodes = []
        cityAndZipcodes.forEach(({city,zipcodes})=> {
            if(selectedCity.includes(city)){
                newzipcodes = [...newzipcodes,...zipcodes]
               
            }

            }
        )
       
        setZipcodes(newzipcodes)
        zipcodeValue.forEach((zip)=>{
            //console.log("in each.....")
            if(!newzipcodes.includes(zip)){
                //zipcodeValue.splice(zip,1)
                zipcodeValue = zipcodeValue.filter(i=>i!==zip)

            } 
         })
        // console.log("after each.....",zipcodeValue)
         onHandleZipcodeChange(zipcodeValue)
        
    }
  
    useEffect(()=>{
      getCityAndZipcodes()
    },[])
    useEffect(()=>{
        if(value){
        //    let selectedCity = []
        //     value.forEach((item)=>{
        //         cityAndZipcodes.forEach((data)=> {
        //             if(item === data.city)
        //             selectedCity.push(data.city)
        //            })
        //    })
           filterZipcodes(value) 
        }
      },[value])
    return (
        <>
        <Grid
            item
            md={6}
            xs={12}
        >
        <Autocomplete
            id="cities"
            options={cities}
            multiple
            value={value || []}
            defaultValue={value}
            name="city"
            getOptionLabel={(option) =>typeof option === 'string' ? option : option}
            onChange={( e,value) => {onHandleCityChange(value)}}
            renderInput={(params) => <TextField {...params} label="Select City" variant="outlined" 
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city && errors.city}
                />}
        />

          </Grid>
          <Grid
            item
            md={6}
            xs={12}
        >
        <Autocomplete
            id="zipcodes"
            options={zipcodes}
            value={zipcodeValue || []}
            defaultValue={zipcodeValue }
            name="zipcode"
            multiple
            disableCloseOnSelect
            getOptionLabel={(option) =>typeof option === 'string' ? option : option.toString()}
            onChange={( e,value) => {onHandleZipcodeChange(value)}}
            renderInput={(params) =>
                 <TextField {...params} label="Select Zipcode" variant="outlined" 
                error={Boolean(touched.zipcode && errors.zipcode)}
                helperText={touched.zipcode && errors.zipcode}
            />}
            />

          </Grid>
        </>
    )
}

export default CityAndZipcodes