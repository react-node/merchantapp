import  * as config from '../utils/config'
import useServiceCalls from './useServiceCalls'

const useDashboard = ()=>{
    const {get,put} = useServiceCalls()
   
    const getMenu = async (id)=>{
        const filter = id ? `?id=${id}` : ""
        const url=`${config.API_URI}${config.STORETYPE}${filter}`
        const menu = get(url,false)
        return menu

    }
    const getSliderImages =async (zipcode)=>{

        const url=`${config.API_URI}${config.BANNERS}?zipcode=${zipcode}`
        const resp = await get(url,false)
        const bannersArray = resp.data.banners
        const defaultArray = resp.data.defaultImage
        let imageslider_1 = bannersArray.map(item=>{ 
            let bannersInfo = item.bannerDetails.id,
            orderID = item.orderID,
            ownerID = item.ownerID

            return {...bannersInfo,orderID,ownerID}
        })
        let imageslider_2 = []
        if(bannersArray.length < 3 && defaultArray.length >0){
        let iteration = 3 - bannersArray.length
        for(let i=0; i<iteration; i++){
            imageslider_1.push(defaultArray[i])
        }
        for(let i=iteration; i<defaultArray.length; i++){
            imageslider_2.push(defaultArray[i])
        }
        
        }
        return {imageslider_1,imageslider_2}
    }
    const getPaidOffers =async (zipcode)=>{
        const url=`${config.API_URI}${config.PAID_OFFERS}?zipcode=${zipcode}`
        const resp = await get(url,false)
       // if(resp)
        const MultiSliderOffers = [...resp.data.paidOffers,...resp.data.storeOffers]
       
        return MultiSliderOffers
    }
    const getNearByOffers =async (zipcode,lat,lng,page=1,type=null,category='',pageSize=10)=>{
        try {
            if(!zipcode) throw new Error("51001")
            const offerType = type ? `&categoryID=${type}&categoryType=${category}` : ''
            const url=`${config.API_URI}${config.NEARBY_OFFERS}?zipcode=${zipcode}&geocode=${lng},${lat}&page=${page}&pagesize=${pageSize}${offerType}`
            const resp = await get(url,false)
        
            return resp.data
        } catch (error) {
               
            throw error
            
        }
        
    }
    const updateOfferMetaData =async (type,offerID)=>{
        try {
            if(!offerID) throw new Error("51001")
            const requestBody ={[type]: 1}
            const url=`${config.API_URI}${config.OFFERS_METADATA}/${offerID}`
            const resp = await put(url,requestBody)
        
            return resp.data
        } catch (error) {
               
            throw error
            
        }
        
    }

    return {
        getMenu,
        getSliderImages,
        getPaidOffers,
        getNearByOffers,
        updateOfferMetaData
    }


}

export default useDashboard