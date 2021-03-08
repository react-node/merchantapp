const createError = require('http-errors')
const BannerBooking = require('../Models/BannerBooking.model')
const OfferBooking = require('../Models/OfferBooking.model')
const { SlotBookingValidation ,OfferSlotBookingValidation} = require('../helpers/util_validation_schema')



class SlotBookingController {
    async saveBookingInfo(req){
        try {
        //   const ownerID = req.payload.aud
        //   const requestData = {...req.body,ownerID}
          const validationResult = await SlotBookingValidation.validateAsync(req)

          const saveData = new BannerBooking(validationResult)
          const result =await saveData.save()
          return result

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            throw error
        }
    }
    async searchBannerSlots (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            console.log(zipcodes)
            const SlotsAvailability = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate},zipcode:{$in:zipcodes}}},txn_response_code:"01"}).select("selectStores")
            res.send(SlotsAvailability)

            
        } catch (error) {
            next(error)
        }
    }
    async searchOfferSlots (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            console.log(zipcodes)
            const SlotsAvailability = await OfferBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate},zipcode:{$in:zipcodes}}},txn_response_code:"01"}).select("selectStores")
            res.send(SlotsAvailability)

            
        } catch (error) {
            next(error)
        }
    }
    async getOffersHistory (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            var filter = {ownerID}
            if(req.body.offer){
                filter['offerDetails.id'] = req.body.offer._id

            }
           // const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            //console.log(zipcodes)
            const offersHistory = await OfferBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate}}},...filter}).populate("offerDetails.id","offerName fromDate expireDate discount isActive isDeleted")
            // below query will return offer data if query match otherwise it return null in if column. will get the booking data
            // const offersHistory = await OfferBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate}}},ownerID}).populate({path : "offerDetails.id",
            //     match :{isDeleted : false},
            //     select : "offerName fromDate expireDate discount isActive isDeleted"})
            res.send(offersHistory)
        } catch (error) {
            next(error)
        }
    }
    async getBannerHistory (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            var filter = {ownerID}
            if(req.body.banner){
                filter['bannerDetails.id'] = req.body.banner._id

            }
           // const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            //console.log(zipcodes) 
           // console.log({...filter})
            const bannerHistory = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate}}},...filter}).populate("bannerDetails.id","imagePath isApproved isDeleted")
            
            // below query will return offer data if query match otherwise it return null in if column. will get the booking data
            // const bannerHistory = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate}}},...filter}).populate({path : "bannerDetails.id",
            //     match :{isDeleted : false},
            //     select : "imagePath isApproved isDeleted"})
            res.send(bannerHistory)
        } catch (error) {
            next(error)
        }
    }
    async saveOfferBookingInfo(req){
        try {
        //   const ownerID = req.payload.aud
        //   const requestData = {...req.body,ownerID}
          const validationResult = await OfferSlotBookingValidation.validateAsync(req)

          const saveData = new OfferBooking(validationResult)
          const result =await saveData.save()
          //res.send(result)
          return result

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            //next(error)
            throw error
        }
    }
    async updateBookingTXNID(req,slotType){
        try {
            const {orderID,...rest} = req
            let update_txn_data = []
            if(slotType === "banner"){
                 update_txn_data = await BannerBooking.findOneAndUpdate({orderID },rest)
            }else{
                 update_txn_data = await OfferBooking.findOneAndUpdate({orderID },rest)

            }
            return update_txn_data

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            //next(error)
            return error
        }
    }
    async getOrderDetails(orderID,type){
        try {
            let orderData =[] 
            if(type === "banner"){
                orderData = await BannerBooking.findOne({orderID })
            }else{
                orderData = await OfferBooking.findOne({orderID })

            }
            console.log(type, orderData)
            return orderData

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            //next(error)
            return error
        }
    }

}

module.exports = {
    "SlotBookingController" : new SlotBookingController()
}