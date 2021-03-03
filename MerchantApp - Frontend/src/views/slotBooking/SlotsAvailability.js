import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {GlobalContext} from "../../context/GlobalState"
import { Box, Button, Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import Moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import Services from 'src/services/Services';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));
const ControlledAccordions = () => {
  const classes = useStyles();
  const {type} = useParams()
  const [expanded, setExpanded] = React.useState(false);
  const {bannerSearchData,setBannerSearchData,slotsAvailability} = useContext(GlobalContext)
  const [searchData,setSearchdata] = useState({})
  //const [intervalDatesArray,setIntervalDatesArray] = useState({})
  //const [selectedStores,setSelectedStores] = useState([])
  const [selectedStoresDates,setSelectedStoresDates] = useState([])
  const [priceInfo,setPriceInfo] = useState({})
  const navigate = useNavigate()
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(()=>{
    console.log(bannerSearchData)
    setSelectedStoresDates([])
    if(Object.keys(bannerSearchData).length >0){
      var fromDate = Moment(bannerSearchData.fromDate)
      var toDate = Moment(bannerSearchData.toDate)
     // setSelectedStores(bannerSearchData.selectStore)
      const datediff = toDate.diff(fromDate,'days')
      console.log("datediff----",datediff)
      var datesArray = [{date:fromDate.format("YYYY-MM-DD"),checked:false,count:0,disabled:false}]
      for(var i=1;i<=datediff;i++){
        const nextdate = fromDate.clone().add(i,'d').format("YYYY-MM-DD")
        datesArray.push({date:nextdate,checked:false,count:0,disabled:false})
      }
     // datesArray.push({date : toDate.format("YYYY-MM-DD"),checked:false,count:0})
      bannerSearchData.selectStore.forEach((selectedStore)=>{
        selectedStore.checkAll = false
        selectedStore.slotsArray = JSON.parse(JSON.stringify(datesArray))
        slotsAvailability.forEach(({id,zipcode,selectedDates})=>{
          if(selectedStore.zipcode === zipcode){
          //if(selectedStore.id === id){
            selectedStore.slotsArray.forEach((item)=>{
              if(selectedDates.includes(item.date+"T00:00:00.000Z")){
                item.count = item.count+1
                item.disabled =true
              }
             
            })
          }
          
        })
        
      })
      //setIntervalDatesArray(datesArray)
      setSearchdata(bannerSearchData)
      console.log("bannerSearchData====",bannerSearchData)
      console.log(datesArray)
      
    }else{
      //setIntervalDatesArray([])
      setSearchdata({})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[bannerSearchData])
  const fetchConstData = async (type)=>{

    const priceInfo = await Services.getPrice(type)
    setPriceInfo(priceInfo.data)
  }
  useEffect(()=>{
    // var type= "offer"
    // if(bannerSearchData.banner){
    //   type= "banner"
    // }
    fetchConstData(type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const handleSelecteAll = (e,storeID,zipcode,storeIndex)=>{
    console.log(storeID,zipcode,storeIndex)
    const Sdata = JSON.parse(JSON.stringify(searchData))
    
    Sdata.selectStore[storeIndex].slotsArray.forEach((item,k)=>{
     // item.checked = e.target.checked
     if((item.count < priceInfo.limit )){
       if(!item.disabled)
        handleSelectedDates(e,storeID,item,zipcode,storeIndex,k)

     }
    })
    //handleChange(Sdata.selectStore[storeIndex+1].)
   // setSearchdata(Sdata)
  }
  
  const handleSelectedDates =(e,storeID,selectedObj,zipcode,storeIndex,slotsArrayIndex)=>{
    var selectedDates = selectedStoresDates 
    console.log(e.target.checked,storeID,selectedObj,storeIndex,slotsArrayIndex)
    const Sdata ={...searchData}
    if(e.target.name === "checkAll"){
      Sdata.selectStore[storeIndex].checkAll =  e.target.checked
      
    }
    Sdata.selectStore[storeIndex].slotsArray[slotsArrayIndex].checked = e.target.checked
    selectedDates[storeID] =selectedDates[storeID] || []
    if(e.target.checked){
      if(!selectedDates[storeID].includes(selectedObj.date))
        selectedDates[storeID].push(selectedObj.date)
      if(selectedObj.count===(priceInfo.limit-1)){
        Sdata.selectStore.forEach((store)=>{
          if(store.zipcode===zipcode && storeID!==store.id) {
            store.slotsArray.forEach((slots)=>{
              if(slots.date === selectedObj.date){
                slots.count = slots.count+1
              }
            })
          }
        })
      }else{
        Sdata.selectStore.forEach((store)=>{
          if(store.zipcode===zipcode ) {
            store.slotsArray.forEach((slots)=>{
              if(slots.date === selectedObj.date){
                slots.count = slots.count+1
              }
            })
          }
        })
      }
    }else{
      selectedDates[storeID] = selectedDates[storeID].filter((item)=> item !== selectedObj.date)
      if(selectedObj.count===(priceInfo.limit-1)){
        Sdata.selectStore.forEach((store)=>{
          if(store.zipcode===zipcode && storeID!==store.id) {
            store.slotsArray.forEach((slots)=>{
              if(slots.date === selectedObj.date){
                slots.count = slots.count-1
              }
            })
          }


        })
      }else{
        Sdata.selectStore.forEach((store)=>{
          if(store.zipcode===zipcode ) {
            store.slotsArray.forEach((slots)=>{
              if(slots.date === selectedObj.date){
                slots.count = slots.count-1
              }
            })
          }
        })
      }
    }
   
      setSelectedStoresDates(selectedDates)
      for(var i=0;i < Sdata.selectStore[storeIndex].slotsArray.length;i++){
        Sdata.selectStore[storeIndex].checkAll = e.target.checked
        if(!Sdata.selectStore[storeIndex].slotsArray[i].checked && Sdata.selectStore[storeIndex].slotsArray[i].count < priceInfo.limit && !Sdata.selectStore[storeIndex].slotsArray[i].disabled){
          Sdata.selectStore[storeIndex].checkAll = false
          break
        }
      }
      // Sdata.selectStore[storeIndex].slotsArray.forEach(item=>{
      //   if(!item.checked && item.count <priceInfo.limit)
      //   {
      //     Sdata.selectStore[storeIndex].checkAll = false
      //     return false
      //   }
      // })
      setSearchdata(Sdata)
    
      console.log(selectedDates)
  }
  // useEffect(()=>{
  //   setSearchdata(diplicateSearchData)
  // },[diplicateSearchData.selectStore])
  const submitSelectedSlots = ()=>{
    //var finalArray = []
    const FilteredArray = searchData.selectStore.filter((item)=>{
      var id = item.id
      if(selectedStoresDates[id] && selectedStoresDates[id].length >0){
        item.selectedDates = selectedStoresDates[id]
        return item
      }
     return false
    })

    // Object.keys(selectedStoresDates).map((item,k)=>{
    //   finalArray.push({"storeID": item, "selectedDates" : selectedStoresDates[item]})
    // })
    setBannerSearchData({...searchData,selectStore:FilteredArray})
    navigate("/app/slot_booking/next")

  }

  return (
    <div className={classes.root}>
      {Object.keys(searchData).length > 0 && 
      (<>
      {searchData.selectStore.map((store,storeIndex)=>
       
        <Accordion key={store.id} expanded={expanded === store.id} onChange={handleChange(store.id)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id={store.id}
        >
          <Typography className={classes.heading}>{store.name}</Typography>
          <Typography className={classes.secondaryHeading}>{store.zipcode}</Typography>
        </AccordionSummary>
        <AccordionDetails>
   
        <Grid item container direction="row" spacing={2}>
        <Grid item container justify="flex-end" md={12} xs={12} lg={12} >
        <FormControlLabel
                  control={
                    <Checkbox
                      checked = {store.checkAll ? true:false}
                      onChange={(e)=>handleSelecteAll(e,store.id,store.zipcode,storeIndex)}
                      name="checkAll"
                      color="primary"
                    />
                  }
                  label="Check All"
                />
                </Grid>
          {store.slotsArray.map((item,k) => (
           
             <Grid item key={k}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked = {item.checked ? true : false}
                      //value = {item.checked ? true : false}
                      disabled = {(item.count >=priceInfo.limit && !item.checked )|| item.disabled ? true : false}
                      onChange={(e)=>handleSelectedDates(e,store.id,item,store.zipcode,storeIndex,k)}
                      name={item.date}
                      color="primary"
                    />
                  }
                  label={item.date}
                />
                <Typography variant="body2" component={"span"}>
                      {item.count < priceInfo.limit && !item.disabled  ? 'Available' : ( !item.disabled ? 'Not Available' : 'Not Allowed') }
                </Typography>
              </Grid>
          
          ))}
        </Grid>
        </AccordionDetails>
      </Accordion>
      
        )}
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={submitSelectedSlots}
          >
            Next
          </Button>
        </Box>
        </>)
      }

     </div>
  );
}


export default ControlledAccordions