import React, { useContext, useState } from "react"

import { Box, Button, Card, CardContent, Grid, makeStyles, TextField } from "@material-ui/core";
import clsx from "clsx";
import { Formik } from "formik";
import * as Yup from 'yup';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CityAndZipcodes from '../userManagement/components/CityAndZipcodes'
import { Autocomplete } from "@material-ui/lab";
import { Context as UserManagemantContext } from 'src/views/admin/userManagement/Context/userManagementContext';

const useStyles = makeStyles((theme) => ({
    root: {},
    importButton: {
      marginRight: theme.spacing(1)
    },
    exportButton: {
      marginRight: theme.spacing(1)
    }
  }));
const FilterToolbar =({ className,initialValues,statusArray,cityZipRequired,handleFetchData, ...rest })=>{
    const classes = useStyles();
    console.log(localStorage.getItem("contextFilterData"))
    const initVal = JSON.parse(localStorage.getItem("contextFilterData")  || JSON.stringify(initialValues))
    const [values,setFilterData] = useState(initVal);
    const {state} = useContext(UserManagemantContext)
    const {tableSortingDetails} = state
    const {page,pageSize,order,orderBy} = tableSortingDetails
    const handleCityChange = (newValue,setFieldValue) =>{
        setFieldValue("city",newValue)
    }
    const handleZipcodeChange= (newValue,setFieldValue)=>{
        setFieldValue("zipcode",newValue)
    }
    const onChangeFromDate = (value,setFieldValue)=>{
        setFieldValue('fromDate', value);
    // if(value > toDate){
           // setFieldValue('toDate', value)
      //  }
    }
    const searchData = async (values,setSubmitting)=>{
      localStorage.setItem("contextFilterData",JSON.stringify(values))
        
        await handleFetchData(page,pageSize,order,orderBy,{},values)
        setSubmitting(false)
    }
    const resetFilter =  async (resetForm)=>{
      localStorage.removeItem("contextFilterData")
      setFilterData( {
        fromDate :null,
        toDate :null,
        city : [],
        zipcode : [],
        status: 0
    })
    resetForm()
     await handleFetchData(page,pageSize,order,orderBy,{},initialValues)
    }
    // useEffect(()=>{
    //   const featchData = async() =>{
    //     const {page,pageSize,order,orderBy} = tableSortingDetails
    //     await handleFetchData(page,pageSize,order,orderBy,{},values)
    //   }
    //   featchData()
    // },[values])
    return (<div
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Box>
          <Card>
            <CardContent>
              <Box>
              <Formik
                enableReinitialize
                initialValues={ {...values}}
                validationSchema={Yup.object().shape({
                    fromDate : Yup.string().nullable(),
                    toDate : Yup.string().nullable(),
                    city : Yup.string().nullable(),
                    zipcode : Yup.string().nullable(),
                })}
                onSubmit={(values, { setSubmitting }) =>searchData(values,  setSubmitting )}
                >
                    {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                    setValues,
                    setFieldValue,
                    resetForm
                    }) => (
                    <form
                    name = "createAdminUser"
                    noValidate
                    onSubmit={handleSubmit} 
                    className={clsx(classes.root, className)}
                    {...rest}
                    >
                    <Grid
                    container
                    spacing={3}
                    >
                        { cityZipRequired && (
                        <CityAndZipcodes 
                        touched = {touched}
                        errors = {errors}
                        value={values.city}
                        type = "assignedCities"
                        zipcodeValue={values.zipcode}
                        onHandleCityChange={(newValue)=>handleCityChange(newValue,setFieldValue)}
                        onHandleZipcodeChange={(newValue)=>handleZipcodeChange(newValue,setFieldValue)}
                        />)
                        }
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid
                                item
                                md={3}
                                xs={12}
                                >
                            <KeyboardDatePicker
                            fullWidth
                            variant="inline"
                            error={Boolean(touched.fromDate && errors.fromDate)}
                            helperText={touched.fromDate && errors.fromDate}
                            format="MM/dd/yyyy"
                            name = "fromDate"
                            id="date-picker-fromDate"
                            label="From Date"
                            value={values.fromDate}
                            onChange={( value) => onChangeFromDate (value,setFieldValue)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            /></Grid>
                            <Grid
                                item
                                md={3}
                                xs={12}
                                >
                            <KeyboardDatePicker
                            error={Boolean(touched.toDate && errors.toDate)}
                            helperText={touched.toDate && errors.toDate}
                            fullWidth
                            variant="inline"
                            format="MM/dd/yyyy"
                            name = "toDate"
                            id="date-picker-toDate"
                            label="To Date"
                            minDate={values.fromDate || new Date("2000-01-01")}
                            value={values.toDate}
                            onChange={( value) => setFieldValue('toDate', value)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <Grid
                            item
                            md={3}
                            xs={12}
                            >
                            <Autocomplete
                                id="status"
                                options={statusArray}
                                value={values.status || null}
                                name="status"
                                getOptionLabel={(option) =>typeof option === 'string' ? option : option.toString()}
                                onChange={(e,value)=>setFieldValue("status",value)}
                                renderInput={(params) =>
                                    <TextField {...params} label="Select Status" variant="outlined" 
                                   
                                />}
                                />    
                        </Grid>
                        <Box
                            alignSelf="center"
                            p={2}
                            >
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Search
                        </Button>
                        &nbsp;
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={()=>resetFilter(resetForm)}
                        >
                            Clear All
                        </Button>
                        </Box> 
                        </Grid>
                    </form> )}
                </Formik>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>)
}
FilterToolbar.defaultProps = {
    initialValues : {
        fromDate :null,
        toDate :null,
        city : [],
        zipcode : [],
        status: 0
    },
    statusArray : ['Submitted','Approved','Rejected']
  }

export default FilterToolbar