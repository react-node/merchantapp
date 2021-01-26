import * as config from '../../src/utils/config';
import axios from "axios";

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

const GenerateHeaders =()=>{
    var headers = {
        "headers" : {
            "Authorization" : config.ACCESS_TOKEN
        } 
    }
    return headers
}

export default {
    getStore,
    getAllStore,
    deleteStore,
    imageUpload,
    storeImages,
    getstoreImages
}