import React, { useEffect, useRef, useState } from "react"
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import Services from '../../../services/Services'
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const StoresList =({defaultVal,storeHandleChange,isError})=>{
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [stores, setStores] = useState([])
    const [selectedStore, setSelectedstore] = useState([]);
    console.log(defaultVal)
    const  getStores= async ()=>{
      try{
        const storesData = await Services.getAllStore()
        if (_isMounted.current) {
          console.log(storesData)
          const newArray = [{name:"All",_id:"all"},...storesData.data]
          console.log(newArray)
          setStores(newArray)
        }
        
        
      }catch(e){
        console.log(e)
      }
      }
    useEffect( ()=>{
        getStores();
      return () => { // ComponentWillUnmount in Class Component
        _isMounted.current = false;
    }
    },[])
    useEffect(()=>{
      if(defaultVal){
        const defaultstoresdata = stores.filter(({_id,name})=>{
          if(defaultVal.includes(_id))
          return {_id,name}
         
         })
         console.log(defaultstoresdata)
         setSelectedstore(defaultstoresdata)
       }
    },[stores])
    const renderOptions=(option,state)=>{
      {
        const selectFilmIndex = selectedStore.findIndex(
          store => store.name.toLowerCase() === "all"
        );
        if (selectFilmIndex > -1) {
          state.selected = true;
        }
        return (
          <div name="dd">
            <Checkbox
              icon={icon}
              name={option.name}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={state.selected}
              
            />
            <span name="sp">{option.name},{option.address}</span>
          </div>
        );
      }
    }
    return (
        // <FormControl fullWidth required >
        //     <InputLabel id="stores-list">Select Store</InputLabel>
        //     <Select
        //     labelId="stores-list"
        //     id="storesList"
        //     value={values.selectedStore}
        //     onChange={handleChange}
           
        //     name="selectedStore"
        //     >   
        //     <MenuItem value="">
        //         <em>None</em>
        //     </MenuItem>
        //     {stores.map((store)=>(
        //                 <MenuItem key={store._id} value={store._id} >
        //                 {store.name}
        //                 </MenuItem>
        //             ))}
        //     </Select>
        // </FormControl> 
  
            <Autocomplete
              fullWidth
              style={{padding:8}}
              multiple
              limitTags={4}
              id="checkboxes-tags"
              options={stores}
              disableCloseOnSelect
              defaultValue={selectedStore}
              className= {isError? 'Mui-error Mui-required':''}
              value={selectedStore}
              onChange={(e, data) => {
                console.log(e.target.parentElement.parentElement,"-----",e.target.value)
                console.log(data)
                if(data.length >0){
                  const lastObjt = data.length-1
                  if(data[lastObjt]._id==="all"){
                    console.log(stores)
                    setSelectedstore(stores)
                    storeHandleChange(stores)
                  }else{
                    if(e.target.name ==="All"){
                      setSelectedstore([]);
                      storeHandleChange([])
                    }else{
                      const filteredArray  = data.filter((s)=>s._id !== "all")
                      setSelectedstore(filteredArray);
                      storeHandleChange(filteredArray)
                    }
                  

                  }
                }else{
                  setSelectedstore(data)
                }
                console.log(selectedStore)
                
              }}
              getOptionLabel={option => option.name}
              renderOption={(option, state) => renderOptions(option,state)}
              
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                 
                  label="Select Store(s)"
                  placeholder="Stores"
                />
              )}
            />
    
        
    )
}
export default StoresList