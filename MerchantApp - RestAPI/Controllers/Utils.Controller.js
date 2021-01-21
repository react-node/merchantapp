const createError = require('http-errors')
const StoreType = require('../Models/StoreType.model')
const { StoreTypeValidation } = require('../helpers/util_validation_schema')

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
    //get store type and categories.
    async getStoreTypes(req,res,next){
        try {
            const storeTypeData = await StoreType.find()
            res.send(storeTypeData)
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
    }
}

module.exports = UtilsContorller