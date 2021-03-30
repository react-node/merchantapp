const createError = require('http-errors')
const Offers = require('../Models/Offers.model')
const Store = require('../Models/Store.model')
const ProfileModel = require('../Models/User.model')
const AssignedCities = require('../Models/AssignedCities.model')

class ProfileContorller {
    async getProfileDetails(req, res, next){
        try {
           
            const profileData = await ProfileModel.findById(req.payload.aud).select("_id firstName lastName email phoneNumber identityProofs isIDProofVerified")
            res.send(profileData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    async getUsers(req, res, next){
        try {
            const userType = parseInt(req.query.userType) || 0
            const page = parseInt(req.query.page) || 1
            const PAGE_SIZE = parseInt(req.query.pagesize) || 5;                   
            const ORDERBY = req.query.orderBy || "_id";                  
            const searchField = req.query.field || null;                  
            const searchVal = req.query.val || null;                  
            const ORDER = req.query.order === "asc" ? 1 : -1;                   
            const skip = (page - 1) * PAGE_SIZE; 
            let query = {}
            //let query = {userType,isDeleted : false}
            
            if(searchField === "phoneNumber"){
                const queryString = parseInt(searchVal)
                 const regex = new RegExp(queryString)
                 query.phoneNumber =  queryString
              }else if(searchField === "email"){
                const queryString = `${searchVal}`
                const regex = new RegExp(queryString,'i')
                query.email = {$regex: regex}
              }
            const count = await ProfileModel.countDocuments(query)

            const users = await ProfileModel.find(query).select("_id firstName lastName email phoneNumber isVerified ").sort({ [ORDERBY]: ORDER }).skip(skip).limit(PAGE_SIZE)
            res.send({users,count})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async getUser(req, res, next){
        try {
            const _id = req.params.id
            const type = req.params.type
            const user = await AssignedCities.findOne({assignedTo : _id}).populate("assignedTo","_id firstName lastName email phoneNumber isVerified")
            res.send(user) 
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async deleteUsers(req, res, next){
        try {
            await ProfileModel.updateMany({_id:{'$in':req.body}},{isDeleted : true})
            const responseData = {
                status : 200,
                message : "ok"
            }
            res.send(responseData) 
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async updateProfileDetails(req, res, next){
        try {
            const requestPayload = req.body
            const id= requestPayload.editId || req.payload.aud
            delete requestPayload.editId
            const isPhoneFound = await ProfileModel.findOne({phoneNumber: requestPayload.phoneNumber})
            if(isPhoneFound && isPhoneFound.email !== requestPayload.email) throw createError.NotAcceptable("Phone number existed")
            const result = await ProfileModel.findByIdAndUpdate(id,requestPayload,{new:true})
            res.send(result)
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
    async verifyIDProof (req, res, next){
        try {
            const idProofNumber = req.params.idProofNumber
            const result = await ProfileModel.findOne({identityProofs: {$elemMatch:{id_number:idProofNumber}}})
            console.log(result)
            if(result) throw createError.NotAcceptable("Given id is existed")

            res.send({})


        } catch (error) {
            next(error)
            
        }

    }
    async checkGSTNumber (req, res, next){
        try {
            const GSTNumber = req.params.GSTNumber
            const ownerID = req.payload.aud
            const result = await Store.findOne({identity_proof: GSTNumber,owner : ownerID})
            if(!result) throw createError.NotFound("GST Not existed")

            res.send()


        } catch (error) {
            next(error)
            
        }

    }
    
    
}

module.exports = {
    "profileController" : new ProfileContorller()
}