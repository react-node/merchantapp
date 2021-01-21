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
const GenerateHeaders =()=>{
    var headers = {
        "headers" : {
            "Authorization" : config.ACCESS_TOKEN
        }
    }
    return headers
}

export default {getStore}