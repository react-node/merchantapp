import React, { useEffect, useState } from "react"
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Services from '../../../services/Services'
import { Box, Grid } from "@material-ui/core";

const StoresList =({defaultVal,storeHandleChange})=>{
    const [stores, setStores] = useState([])
    const [storeVal,setStoreVal] = useState("")
    console.log(defaultVal)
    useEffect( ()=>{
       const  getStores= async ()=>{
            const storesData = await Services.getAllStore()
            console.log(storesData)
            setStores(storesData.data)
            const SelectDropDownValue = storesData.data.filter(({_id,name})=>{if(_id===defaultVal) return setStoreVal({_id,name})})
            setStoreVal(SelectDropDownValue)
        }
        getStores();
    },[])
    const callParentcomponentfn=(newValue)=>{
        storeHandleChange((newValue))
        console.log(storeVal)
    }

    return (
        <Grid  item md={12}
        xs={12}>
        {stores.length >0 && (
            <Autocomplete
            
            id="StoreList"
            options={stores}
            getOptionLabel={(option) =>typeof option === 'string' ? option : option.name }
            fullWidth
            onChange={(event, newValue) => {
              console.log(newValue)
              setStoreVal(newValue)
              callParentcomponentfn(newValue)
            }}
            value={storeVal}
            getOptionSelected= {(
              option,
              value,
           ) => value._id === option._id}
            name="selectStore"
            renderInput={(store) => <TextField {...store} label="Select Store" variant="outlined" />}
          />
        )}
        
        </Grid>
  
         
    
        
    )
}
export default StoresList