const Store = require('../Models/Store.model')
const Branches = require('../Models/Branches.Model')
const { StoreValidation } = require('../helpers/validation_schema')
const { validateStore } = require('../helpers/storeDuplicateCheck')
const { getAssignedZipcodes } = require('../helpers/utils')
const createError = require('http-errors')
const StoreContorller = {
    async addStore(req, res, next){
        try {
            const requestPayload = req.body
            requestPayload.owner = req.payload.aud
            const result = await StoreValidation.validateAsync(requestPayload)
            const isSotreExisted = await validateStore(requestPayload)
            if(isSotreExisted) throw createError.Conflict()
            const store = new Store(result)
            const StoreInfo = await store.save()
            const storeID = StoreInfo._id
            // if(requestPayload.hasMainBranch){
            //   const addBranchData = await Branches.findOne({"storeID" : requestPayload.mainBranchID })
            //   console.log(addBranchData)
            //   if(!addBranchData){
            //     var newRecord = {
            //       storeID : requestPayload.mainBranchID,
            //       owner : requestPayload.owner,
            //       branches: [storeID]
            //     }
            //     const newBranchRecord = new Branches(newRecord)
            //      newBranchRecord.save()
            //   }else{
            //     addBranchData.branches.push(storeID)
            //    await addBranchData.save() 
            //   }

            // }

            res.send(StoreInfo)
          } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
          }
    },
    async getStores(req,res,next){
        try {
            const page = req.query.page || 1
            const filter = req.query.searchstring || null
            const userType = parseInt(req.query.userType) || 3
            const filterType = req.query.type || null
            const zipcodes = req.query.zipcodes || null
            const ORDERBY = req.query.orderBy || "_id";
            const ORDER = req.query.order === "asc" ? 1 : -1;
            const status = parseInt(req.query.status);
            const PAGE_SIZE = 9;                   // Similar to 'limit'
            const skip = (page - 1) * PAGE_SIZE; 
            const fromDate = req.query.fromDate;
            const toDate = req.query.toDate;
           
            let query = { isDeleted:false}
            if(userType === 3) query.owner = req.payload.aud
            if(userType === 2) {
              let zipcodesArray = []
              if(zipcodes){
                zipcodesArray = zipcodes.split(",")
              }else{
                const result = await getAssignedZipcodes(req.payload.aud)
                console.log(result)
                zipcodesArray = result.assignedData.zipcodes
                
                console.log(zipcodesArray)
              }
              
              query.zipcode = {$in : zipcodesArray}
            }
            if(fromDate && toDate){
              query.createdAt = { $gte: fromDate, $lte: toDate + "T23:59:59" }
            }else if(fromDate) {
              query.createdAt = { $gte: fromDate }
            }else if(toDate) {
              query.createdAt = { $lte: toDate + "T23:59:59"  }
            }
            if(status) query.status = status
            if(filterType === "zipcode"){
              query.zipcode = filter
            }else if(filterType === "name"){
              const queryString = `${filter}`
              
              const regex = new RegExp(queryString, 'i')
              console.log(queryString)
              query.name = {$regex: regex}
            }

            console.log(query)
            const count = await Store.countDocuments(query)
            const storesData = await Store.find(query).sort({[ORDERBY]: ORDER }).skip(skip).limit(PAGE_SIZE)
            res.send({storesData,count})
          } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
          }
    },
    async getAllStores(req,res,next){
      try {
         
          let query = {owner : req.payload.aud, isDeleted:false}
         
          const storesData = await Store.find(query).sort({ _id: -1 })
          const responseStore = storesData.map(({_id,name,address,zipcode})=>{return {_id,name,address,zipcode}})
          res.send(responseStore)
        } catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
  },
  async updateStore(req,res,next){
    try {
      const requestPayload = req.body
      // if(!requestPayload._id){
      //   requestPayload.owner = req.payload.aud

      // }
      const result = await StoreValidation.validateAsync(requestPayload)
      console.log(requestPayload._id)
      var resultArray = await Store.findByIdAndUpdate(requestPayload._id,requestPayload)
      if(!resultArray){
        const message = "Store not found"
        return next(createError[404](message))
      }
      var response = {message : "store updated",status:"ok"}


      res.send(response)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  async deleteStore(req,res,next){
    try {
      const storeID = req.params.storeID
     // const storeTypeData = await Store.findByIdAndDelete(storeID)
      const storeTypeData = await Store.findByIdAndUpdate(storeID,{isDeleted:true})
      if(!storeTypeData){
          return next(createError.NotFound)
      }
      res.send(storeTypeData)
    } catch (error) {
        next(error)
    }
  },
  async getStoreByID(req,res,next){
    try {
      const storeID = req.params.storeID
     // const storeTypeData = await Store.findByIdAndDelete(storeID)
      const storeTypeData = await Store.findById(storeID)
      if(!storeTypeData){
          return next(createError.NotFound)
      }
      res.send(storeTypeData)
    } catch (error) {
        next(error)
    }
  }
}

module.exports = StoreContorller