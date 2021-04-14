import * as config from '../../src/utils/config';
import axios from "axios";
import moment from 'moment';

const GenerateHeaders =()=>{
    const token = window.sessionStorage.getItem('token')
    var headers = {
        "headers" : {
            "Authorization" : `Bearer ${token}`
        } 
    }
    return headers
}
const getCityAndZipcodes = async (selectedCities = [])=>{
    const headers = GenerateHeaders()
    let filter = ''
    if(selectedCities.length > 0)  filter += `?cities=${selectedCities.toString()}`
    const response = await axios.get(config.API_URI+config.CITY_ZIPCODES+filter,headers);
    return response
}
const assignCitiesToUser = async (city,zipcodes,id)=>{
    const headers = GenerateHeaders()
    const requestPayload = {
        assignedData : {city,zipcodes},
        assignedTo : id,
    }
    const response = await axios.post(config.API_URI+config.ASSIGN_CITY_ZIPCODES,requestPayload,headers);
    return response
}
const getUsers = async (page,pageSize,order,orderBy,userType,searchCriteria,filterOptions={})=>{
    const headers = GenerateHeaders()
    let filter =`?pagesize=${pageSize}&page=${page}&orderBy=${orderBy}&order=${order}&userType=${userType}`
    if(Object.keys(searchCriteria).length >0 )
        filter += `&field=${searchCriteria.type}&val=${searchCriteria.searchString}`
    if(Object.keys(filterOptions).length >0 )   {
        if(filterOptions.fromDate && filterOptions.toDate){
            const fromDate = moment(filterOptions.fromDate).format('YYYY-MM-DD')
            const toDate = moment(filterOptions.toDate).format('YYYY-MM-DD')
            filter += `&fromDate=${fromDate}&toDate=${toDate}`
        }
        if(filterOptions.status) {
            var status=0
            if(filterOptions.status === "Submitted"){
                status=1
            }else if(filterOptions.status === "Approved"){
                status=2

            }else if(filterOptions.status === "Rejected"){
                status=3

            }
            filter += `&status=${status}`
        }
    }
   
    const response = await axios.get(config.API_URI+config.GET_USERS+filter,headers);
    return response
}
const getUserByID = async (id,type=1)=>{
    const headers = GenerateHeaders()
    
    const response = await axios.get(config.API_URI+config.GET_USER+`/${type}/${id}`,headers);
    return response
}
const deleteUsers= async (requestPayload)=>{
    const headers = GenerateHeaders()
    //const requestdatawithHeader = {...headers,data:requestPayload,}
    
    const responseData = await axios.delete(config.API_URI+config.GET_USERS,{...headers,data:requestPayload})
    return responseData
}

export default {
    getCityAndZipcodes,
    assignCitiesToUser,
    getUsers,
    getUserByID,
    deleteUsers
}