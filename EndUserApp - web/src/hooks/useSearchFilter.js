import { useContext } from "react"
import { Context as GlobalContext } from '../globalContext/globalContext'
import {
    API_URI,SEARCH_STORE,
    GET_STORE_AND_OFFER,
    SEARCH_STORE_INSIDE_MALL,
    GET_ALL_STORE_BY_SEARCH,
    SEARCH_PRODUCT_CATEGORY
} from '../utils/config';
import useServiceCalls from './useServiceCalls'
import {  useSnackbar } from 'notistack';
import useLocationData from "./useLocationData";

const useSearchFilter = (type)=>{
  const {setSearchModel,setAccessToken} = useContext(GlobalContext)
  const {get} = useServiceCalls()
  const { enqueueSnackbar } = useSnackbar();
  const {zipcode,lat,lng} = useLocationData()

  const alertPosition = { horizontal: "right", vertical: "top" }
  
  const searchData =async (searchString,type)=> {

    try {
        if(type==="store"){
            const searchResult = await getStroeData(searchString)
            return searchResult.data
        }
        else if(type==="mall"){
            const searchResult = await getMallData(searchString)
            return searchResult.data
        }else if(type==="category"){
            const searchResult = await getProductCategory(searchString)
            return searchResult.data
        }
        else{
            return []
        }
       
    } catch (error) {
        throw error
    }

  }
  const getStroeData = async (searchString)=>{
    try {
        const url = `${API_URI}${SEARCH_STORE}/${searchString}`
        const storeData = await get(url,false)
        return storeData
    } catch (error) {
        throw error
    }
  }
  const getMallData = async (searchString)=>{
    try {
        const url = `${API_URI}${SEARCH_STORE_INSIDE_MALL}/${searchString}`
        const storeData = await get(url,false)
        return storeData
    } catch (error) {
        throw error
    }
  }
  const getProductCategory = async (searchString)=>{
    try {
        const url = `${API_URI}${SEARCH_PRODUCT_CATEGORY}/${searchString}`
        const storeData = await get(url,false)
        return storeData
    } catch (error) {
        throw error
    }
  }
  const getStoreAndOffer = async (id,type,page,category=null)=>{
    try {
        var categoryFilter = ''
        if(category){
            categoryFilter = `&category=${category}`
        }
        const url = `${API_URI}${GET_STORE_AND_OFFER}?id=${id}&geocode=${lat},${lng}&type=${type}&page=${page}${categoryFilter}`
        const storeData = await get(url,false)
        return storeData.data
    } catch (error) {
        throw error
    }
  }
  const getAllStoreAndOffer = async (searchString,type,page)=>{
    try {

        const url = `${API_URI}${GET_ALL_STORE_BY_SEARCH}?searchString=${searchString}&type=${type}&geocode=${lat},${lng}&page=${page}`
        const storeData = await get(url,false)
        return storeData.data
    } catch (error) {
        throw error
    }
  }


    return {searchData,getStoreAndOffer,getAllStoreAndOffer,getProductCategory}
}

export default useSearchFilter