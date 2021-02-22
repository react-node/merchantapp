const createError = require('http-errors')
const Offers = require('../Models/Offers.model')
const Store = require('../Models/Store.model')
const ProfileModel = require('../Models/User.model')


class ProfileContorller {
    async getProfileDetails(req, res, next){
        try {
           
            const profileData = await ProfileModel.findById(req.payload.aud)
            res.send(profileData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    async updateProfileDetails(req, res, next){
        try {
            const requestPayload = req.body
            const profileData = await ProfileModel.findByIdAndUpdate(req.payload.aud,requestPayload,{new:true})
            res.send(profileData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    async dashboard(req, res, next){
        try {
            let query = {owner : req.payload.aud,isDeleted:false}
            let query_1 = {ownerID : req.payload.aud,isDeleted:false}
            const TotalStores = await Store.countDocuments(query)
            const TotalOffers = await Offers.countDocuments(query_1)
            const TotalActiveStoresData = await Store.find(query).select("_id name address profilepic updatedAt owner").sort({updatedAt : -1}).limit(5)
            const TotalActiveOffersData = await Offers.find(query_1).select("_id offerName isActive status likes views shares fromDate expireDate updatedAt").sort({updatedAt : -1}).limit(6)
            query.isActive = true
            query_1.isActive = true
            const TotalActiveStores = await Store.countDocuments(query)
            const TotalActiveOffers = await Offers.countDocuments(query_1)
            
            const responseData = {
                TotalStores,
                TotalOffers,
                TotalActiveStores,
                TotalActiveOffers,
                TotalActiveStoresData,
                TotalActiveOffersData
            }
            res.send(responseData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    
    
}

module.exports = {
    "profileController" : new ProfileContorller()
}