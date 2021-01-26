const Store = require('../Models/Store.model')
const Branches = require('../Models/Branches.Model')
const { StoreValidation } = require('../helpers/validation_schema')
const createError = require('http-errors')
const StoreContorller = {
    async addStore(req, res, next){
        try {
            const requestPayload = req.body
            requestPayload.owner = req.payload.aud
            const result = await StoreValidation.validateAsync(requestPayload)
            const store = new Store(result)
            const StoreInfo = await store.save()
            const storeID = StoreInfo._id
            if(requestPayload.hasMainBranch){
              const addBranchData = await Branches.findOne({"storeID" : requestPayload.mainBranchID })
              console.log(addBranchData)
              if(!addBranchData){
                var newRecord = {
                  storeID : requestPayload.mainBranchID,
                  owner : requestPayload.owner,
                  branches: [storeID]
                }
                const newBranchRecord = new Branches(newRecord)
                 newBranchRecord.save()
              }else{
                addBranchData.branches.push(storeID)
               await addBranchData.save() 
              }

            }

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
            const filterType = req.query.type || null
            const PAGE_SIZE = 9;                   // Similar to 'limit'
            const skip = (page - 1) * PAGE_SIZE; 
           
            let query = {owner : req.payload.aud}
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
            const storesData = await Store.find(query).sort({ _id: -1 }).skip(skip).limit(PAGE_SIZE)
            res.send({storesData,count})
          } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
          }
    },
    async getAllStores(req,res,next){
      try {
         
          let query = {owner : req.payload.aud}
         
          const storesData = await Store.find(query).sort({ _id: -1 })
          res.send(storesData)
        } catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
  },
  async updateStore(req,res,next){
    try {
      const requestPayload = req.body
      requestPayload.owner = req.payload.aud
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
      const storeTypeData = await Store.findByIdAndDelete(storeID)
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