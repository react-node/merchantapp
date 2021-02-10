import * as config from '../../src/utils/config';
import axios from "axios";
import { GlobalContext } from "../context/GlobalState";
import { useContext } from 'react';

const userVerification =async (token,id)=>{
    const RequestPayload = {token,id}
    const verifyUserResponse = await axios.post(config.API_URI+config.USER_VERIFY,RequestPayload)
    return verifyUserResponse
}
const forgotPassword =async (RequestPayload)=>{
    //const RequestPayload = {token,id}
    const verifyUserResponse = await axios.post(config.API_URI+config.FORGOT_PASSWORD,RequestPayload)
    return verifyUserResponse
}

const getStore= async (page=1,searchFilter={})=>{
    const headers = GenerateHeaders()
    var filter =""
    if(searchFilter.type === 'zipcode'){
        filter = "&searchstring="+searchFilter.searchString+"&type=zipcode"
    }else if(searchFilter.type === 'name'){
        filter = "&searchstring="+searchFilter.searchString+"&type=name"

    }
    const responseData = await axios.get(config.API_URI+config.STORES+"?page="+page+filter,headers)
    return responseData
}
const getAllStore= async ()=>{
    const headers = GenerateHeaders()
    
    const responseData = await axios.get(config.API_URI+config.GET_ALL_STORES,headers)
    return responseData
}
const deleteStore= async (storeID)=>{
    const headers = GenerateHeaders()
    
    const responseData = await axios.delete(config.API_URI+config.STORES+`/${storeID}`,headers)
    return responseData
}
const imageUpload = async (imageData)=>{
    const headers = GenerateHeaders()
    // headers.onUploadProgress = (progressEvent)=> {
    //     var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //     console.log(percentCompleted)
    // } 
    const responseData  = await axios.post(config.API_URI+config.IMAGE_UPLOAD,imageData,headers)
    return responseData
}
const storeImages= async (requestBody) =>{
    const headers =GenerateHeaders()
    const responseData = await axios.post(config.API_URI+config.STORE_IMAGE_DB, requestBody,headers)
    return responseData
}
const getstoreImages= async (storeID,page=1) =>{
    const headers =GenerateHeaders()
    const responseData = await axios.get(config.API_URI+config.STORE_IMAGE_DB+"/"+storeID+"?page="+page,headers)
    return responseData
}
const saveOffer= async (RequestPayload) =>{
    const headers =GenerateHeaders()
    const responseData = await axios.post(config.API_URI+config.OFFERS,RequestPayload,headers)
    return responseData
}
const updateOffer= async (RequestPayload) =>{
    const headers =GenerateHeaders()
    const responseData = await axios.put(config.API_URI+config.OFFERS,RequestPayload,headers)
    return responseData
}

const GenerateHeaders =()=>{
    const token = window.sessionStorage.getItem('token')
    var headers = {
        "headers" : {
            "Authorization" : `Bearer ${token}`
        } 
    }
    return headers
}
const getOffers= async (page=1,searchFilter={},pageSize=9)=>{
    const headers = GenerateHeaders()
    let filter ='&pagesize='+pageSize 
    if(searchFilter.type){
        filter=`&searchstring=${searchFilter.searchString}&type=${searchFilter.type}`
    }
    if(searchFilter.storeID) 
    filter += `&storeid=${searchFilter.storeID}`
    const responseData = await axios.get(config.API_URI+config.OFFERS+"?page="+page+filter,headers)
    return responseData
}
const deleteOffer= async (offerID,storeID=null)=>{
    const headers = GenerateHeaders()
    let filter = ''
    if(storeID){
        filter = "?storeid="+storeID

    }
    const responseData = await axios.delete(`${config.API_URI}${config.OFFERS}/${offerID}${filter}`,headers)
    return responseData
}
const getStoresByID= async (storeIDs)=>{
    const headers = GenerateHeaders()
    const responseData = await axios.post(`${config.API_URI}${config.GET_STORES_BY_ID}`,storeIDs,headers)
    return responseData
}
const updatePassword= async (requestData)=>{
    const headers = GenerateHeaders()
    const responseData = await axios.post(`${config.API_URI}${config.RESET_PASSWORD}`,requestData,headers)
    return responseData
}
const dashboard = async ()=>{
    const headers = GenerateHeaders()
    const responseData = await axios.get(`${config.API_URI}${config.DASHBOARD}`,headers)
    return responseData
}
const getProfileData = async ()=>{
    const headers = GenerateHeaders()
    const responseData = await axios.get(`${config.API_URI}${config.PROFILE}`,headers)
    return responseData
}

export default {
    getStore,
    getAllStore,
    deleteStore,
    imageUpload,
    storeImages,
    getstoreImages,
    saveOffer,
    getOffers,
    deleteOffer,
    updateOffer,
    getStoresByID,
    userVerification,
    forgotPassword,
    updatePassword,
    dashboard,
    getProfileData
}