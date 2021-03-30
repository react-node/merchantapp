import * as config from '../../src/utils/config';
import axios from "axios";
const GenerateHeaders =()=>{
    const token = window.sessionStorage.getItem('token')
    var headers = {
        "headers" : {
            "Authorization" : `Bearer ${token}`
        } 
    }
    return headers
}
const getCityAndZipcodes = async ()=>{
    const headers = GenerateHeaders()
    
    const response = await axios.get(config.API_URI+config.CITY_ZIPCODES,headers);
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
const getUsers = async (page,pageSize,order,orderBy,userType,searchCriteria)=>{
    const headers = GenerateHeaders()
    let filter =`?pagesize=${pageSize}&page=${page}&orderBy=${orderBy}&order=${order}&userType=${userType}`
    if(Object.keys(searchCriteria).length >0 )
        filter += `&field=${searchCriteria.type}&val=${searchCriteria.searchString}`
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