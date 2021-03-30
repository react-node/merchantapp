const createError = require('http-errors')
const StoreType = require('../Models/StoreType.model')
const MallModel = require('../Models/Malls.model')
const CityZipcodes = require('../Models/CityZipcodes.model')
const AssignedCities = require('../Models/AssignedCities.model')
const { StoreTypeValidation } = require('../helpers/util_validation_schema')
const User = require('../Models/User.model')

const UtilsContorller = {
    async addStoreType(req, res, next){
        try {
            const result = await StoreTypeValidation.validateAsync(req.body)
            const storeType = new StoreType(result)
            const StoreTypeData = await storeType.save()
            res.send(StoreTypeData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    async addMalls(req, res, next){
        try {
            //const result = await MallModel.validateAsync(req.body)
            const requestPayload = req.body.map(item=> ({...item , owner: req.payload.aud}))
            const mallModelData = await MallModel.insertMany(requestPayload)
           // const mallModelData =  mallModel()
            res.send(mallModelData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    async addCityZipcodes(req, res, next){
        try {
            //const result = await MallModel.validateAsync(req.body)
            const requestPayload = req.body.map(item=> ({...item , owner: req.payload.aud}))
            const resultData = await CityZipcodes.insertMany(requestPayload)
           // const mallModelData =  mallModel()
            res.send(resultData)
        } catch (error) {
            
            next(error)
        }
    },
    async getCityZipcodes(req, res, next){
        try {
           
            const resultData = await CityZipcodes.find({}).select('_id city zipcodes')
           // const mallModelData =  mallModel()
            res.send(resultData)
        } catch (error) {
            
            next(error)
        }
    },
    async assignCityZipcodes(req, res, next){
        try {
            const owner = req.payload.aud

            const requestPayload = {...req.body,owner}
            var newUserID = requestPayload.assignedTo
            console.log(requestPayload)
            var isExisted = await AssignedCities.findOne({assignedTo : newUserID})
            let resultData
            if(!isExisted){
                const assignCities =  new AssignedCities(requestPayload)
                resultData = await assignCities.save()
            }else{
                resultData =  await AssignedCities.findOneAndUpdate({assignedTo : newUserID},requestPayload,{new : true})
               
            }
           
            res.send(resultData)
        } catch (error) {
           // if(error.status === 500){
            if(!isExisted){
                var deleteUser = await User.findByIdAndDelete(newUserID)
                var deleteassignedData = await AssignedCities.findOneAndDelete({assignedTo : newUserID})
            }
            //}
            next(error)
        }
    },
    //get store type and categories.
    async getStoreTypes(req,res,next){
        try {
            const storeTypeData = await StoreType.find()
            res.send(storeTypeData)
          } catch (error) {
           
            next(error)
          }
    },
    async getMalls(req,res,next){
        try {
            const zipcode = req.params.zipcode
            const mallsData = await MallModel.find({zipcode}).select("_id mallName")
            res.send(mallsData)
          } catch (error) {
           
            next(error)
          }
    },
    async updateStoreCategories(req,res,next){
        try {
            const updates = Object.keys(req.body)
            const storeID = req.params.storeID
            const allowedUpdates = ['categories']
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
            if (!isValidOperation || updates.length===0) {
                const message = "Invalid Updates!"
                return next(createError[400](message))
            }
            const storeTypeData = await StoreType.findById(storeID)
            console.log(storeTypeData)
            if(!storeTypeData){
                const message = "Store type id not found"
                return next(createError[404](message))
            }
            storeTypeData.categories = req.body.categories
            const result =  await storeTypeData.save()
            res.send(result)
        } catch (error) {
            next(error)
        }
    },
    async deleteStoreCategories(req,res,next){
        try {
            const storeID = req.params.storeID
            const storeTypeData = await StoreType.findByIdAndDelete(storeID)
            if(!storeTypeData){
                return next(createError.NotFound)
            }
            res.send(storeTypeData)
        } catch (error) {
            next(error)
        }
    },
    async getprice(req,res,next){
        try {
            const type = req.params.type
            let response = {}
            if(type=== "offer"){
                response = {price : 100,limit:10}
            }else if(type === "banner"){
                response = {price : 200,limit:5}
            }
            res.send(response)
        } catch (error) {
            next(error)
        }

    },

}

module.exports = UtilsContorller