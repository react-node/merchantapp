const createError = require('http-errors')
const BannerBooking = require('../Models/BannerBooking.model')
const OfferBooking = require('../Models/OfferBooking.model')
const { SlotBookingValidation ,OfferSlotBookingValidation} = require('../helpers/util_validation_schema')



class SlotBookingController {
    async saveBookingInfo(req, res, next){
        try {
          const ownerID = req.payload.aud
          const requestData = {...req.body,ownerID}
          const validationResult = await SlotBookingValidation.validateAsync(requestData)

          const saveData = new BannerBooking(validationResult)
          const result =await saveData.save()
          res.send(result)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    async searchBannerSlots (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            console.log(zipcodes)
            const SlotsAvailability = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate},zipcode:{$in:zipcodes}}}}).select("selectStores")
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
            const SlotsAvailability = await OfferBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate},zipcode:{$in:zipcodes}}}}).select("selectStores")
            res.send(SlotsAvailability)

            
        } catch (error) {
            next(error)
        }
    }
    async saveOfferBookingInfo(req, res, next){
        try {
          const ownerID = req.payload.aud
          const requestData = {...req.body,ownerID}
          const validationResult = await OfferSlotBookingValidation.validateAsync(requestData)

          const saveData = new OfferBooking(validationResult)
          const result =await saveData.save()
          res.send(result)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }

}

module.exports = {
    "SlotBookingController" : new SlotBookingController()
}