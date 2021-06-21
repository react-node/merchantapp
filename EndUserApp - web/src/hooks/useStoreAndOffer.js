import { useEffect, useRef, useState } from "react"
import useServiceCalls from "./useServiceCalls"
import * as config from '../utils/config'
import {  useSnackbar } from 'notistack';

const { useParams } = require("react-router-dom")

const useStoreAndOffer=()=>{
    const {storeID,offerID} = useParams()
    const {get} = useServiceCalls()
    const [storeDetails,setStoreDetails] = useState({})
    const [storeOffers,setStoreOffers] = useState([])
    const [storeImages,setStoreImages] = useState([])
    const [isResponseEmpty,setIsResponseEmpty] = useState(false)
    const [isResponseEmptyofImages,setIsResponseEmptyofImages] = useState(false)
    const [selectedOffer,setSelectedOffer] = useState({})
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    console.log(storeID,offerID)
    //perfect fix to memory leak when unmount the component.
    const unmounted = useRef(false);
    useEffect(() => {
        return () => { 
            unmounted.current = true 
        }
    }, []);

    const getStoreDetails = async ()=>{
        try {
            const url=`${config.API_URI}${config.STORES}/${storeID}`
            const resp = await get(url)
            if(!unmounted.current){
                setStoreDetails(resp.data)
            }
        } catch (error) {
            console.log(error)
            if(!unmounted.current){
                enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
            }
        }
       


    }
    const getStoreOffers = async (page)=>{
        try {
            if(!isResponseEmpty){
                const url=`${config.API_URI}${config.OFFERS}?storeid=${storeID}&page=${page}`
                const resp = await get(url)
                if(!unmounted.current){
                const resultArray  = resp.data.offersData 

                let selectedOffer = {}
                if(page==1)
                {
                    if(offerID){
                        selectedOffer = resultArray.find(item=> item._id === offerID)
                        if(!selectedOffer){
                            
                            const url=`${config.API_URI}${config.OFFERS}/${offerID}`
                            const respObj = await get(url)
                            selectedOffer = respObj.data
                        }
                    }else{
                        selectedOffer = resultArray.length >0 ? resultArray[0] : {}
                    }
                    setSelectedOffer(selectedOffer)
                }
                               
                if(resultArray.length===0){
                    setIsResponseEmpty(true)

                }else{
                    setStoreOffers((prevState)=>[...prevState,...resultArray])

                }
            }
        }

        } catch (error) {
            console.log(error)
            if(!unmounted.current){
                enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
            }
            throw error
        }

    }
    const getStoreImages = async (page)=>{
        try {
            if(!isResponseEmptyofImages){
                const url=`${config.API_URI}${config.STORE_IMAGE_DB}/${storeID}?page=${page}&type=4`
                const resp = await get(url)
                const resultArray  = resp.data 

                if(resultArray.length===0){
                    setIsResponseEmptyofImages(true)

                }else{
                    setStoreImages((prevState)=>[...prevState,...resultArray])

                }
            }

        } catch (error) {
            console.log(error)
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
        }

    }
   
    return {
        storeDetails,
        storeOffers,
        selectedOffer,
        storeImages,
        getStoreOffers,
        getStoreDetails,
        getStoreImages
    }
}

export default useStoreAndOffer