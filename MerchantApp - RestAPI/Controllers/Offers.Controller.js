const createError = require('http-errors')
const OffersModel = require('../Models/Offers.model')
const stores = require('../Models/Store.model')
const { OffersModelValidation } = require('../helpers/validation_schema')

class OffersContorller {
    async addOffers(req, res, next){
        try {
           
            const result = await OffersModelValidation.validateAsync(req.body)
            const offersData = new OffersModel(result)
            const offersData_result = await offersData.save()
            res.send(offersData_result)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    async getstoresAndOffers(req, res, next){
        const METERS_PER_MILE = 1609.34
        //const nearbyStores = await stores.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ -73.856077, 40.848447] }, $maxDistance: 5 * METERS_PER_MILE } } ,zipcode : 560066})
        const nearbyStores = await stores.aggregate([
            {
                $geoNear :  { near: { type: "Point", coordinates: [ -73.855077, 40.847447] },distanceField: "distance", maxDistance: 5 * METERS_PER_MILE,spherical: true , query :{ zipcode:560067,isActive : true} }
            },{
                $limit : 10
            },{
                $skip : 0
            },{
                $sort : {distance : -1}
            },{
            $lookup: {
                    from: "offers",
                    localField: "_id",
                    foreignField: "storeID",
                    as: "offers"
                }
        }])
        res.send(nearbyStores)
    }
    
}

module.exports = {
    "offersController" : new OffersContorller()
}