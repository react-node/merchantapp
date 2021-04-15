import {   Grid, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react'
import AdminServices from 'src/services/AdminServices';
import {useSnackbar} from "notistack"
// const useStyles = makeStyles(()=>({
//     root:{},
//     errorInputLable : {
//         color : colors.red[400]
//     }
// }))

const CityAndZipcodes =({value,onHandleCityChange,onHandleZipcodeChange,zipcodeValue,touched,errors,type=null})=>{
  console.log("zipcodeValue---------------->",zipcodeValue)
  console.log("city value---------------->",value)
   
  // const classes = useStyles();
   // const [cities,setCities] = useState([])
    const [cityAndZipcodes,setcityAndZipcodes] = useState([])
    const [assignedCityAndZipcodes,setAssignedCityAndZipcodes] = useState([])
    const [zipcodes,setZipcodes] = useState([])
    const [cities,setCities] = useState([])
    const {enqueueSnackbar} = useSnackbar()
    const alertPosition = { horizontal: "right", vertical: "top" }

    const getAssignedCitiesAndZipcodes= async ()=>{
      try {
        const userType = window.sessionStorage.getItem("userType")
        const result = await AdminServices.getUserByID(0,2) //this will return for both admin and super admin
        console.log("assigned data===",result)
        if(result.data){
          setCities(result.data.assignedData.city)
          setAssignedCityAndZipcodes(result.data.assignedData)
         
        }
      } catch (error) {
        console.log(error)
      }
    }
    const getCityAndZipcodes =async ()=>{
      try {
        console.log("adsfsdfdf")
        const resultData = await AdminServices.getCityAndZipcodes()

        setcityAndZipcodes(resultData.data)
        let c=[]
        resultData.data.forEach((i)=>{

          c.push(i.city)

        })
        setCities(c)
          
      } catch (error) {
        
      }
    }
    const filterZipcodes = async (selectedCity) =>{
        console.log(selectedCity)
        let newzipcodes = []
        if(type==="assignedCities" && selectedCity.length >0){
          console.log("saddddddddd")
          const result = await AdminServices.getCityAndZipcodes(selectedCity)
          const data = result ? result.data : []
          //let assignedZipcodes = []
         // newzipcodes = [...zipcodes]
          data.forEach(({zipcodes})=>{
            if(assignedCityAndZipcodes.zipcodes){
              assignedCityAndZipcodes.zipcodes.forEach((item)=> {
                if(zipcodes.includes(item))
                newzipcodes.push(item)
              })
            }
            
          })

        }else{
          cityAndZipcodes.forEach(({city,zipcodes})=> {
            if(selectedCity.includes(city)){
                newzipcodes = [...newzipcodes,...zipcodes]
               
            }

            }
          )
        }
        
       
        setZipcodes(newzipcodes)
        if(newzipcodes.length > 0){
          zipcodeValue.forEach((zip)=>{
            console.log("in each.....",newzipcodes)
            if(!newzipcodes.includes(zip)){
                //zipcodeValue.splice(zip,1)
                zipcodeValue = zipcodeValue.filter(i=>i!==zip)

            } 
         })
         console.log("after each.....",zipcodeValue)
         onHandleZipcodeChange(zipcodeValue)
        }
       
        
    }
  
    useEffect(()=>{
      if(type === "assignedCities"){
        getAssignedCitiesAndZipcodes()

      }else{
        getCityAndZipcodes()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
      },[value,assignedCityAndZipcodes])
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
            onChange={( e,value) => {
              if(value.length >3 ){
                enqueueSnackbar('you cant able to select more than 3 values',   { variant: "error","anchorOrigin" : alertPosition } );

              }else{
                onHandleZipcodeChange(value)

              }
            }}
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