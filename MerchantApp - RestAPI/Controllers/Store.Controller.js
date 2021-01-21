const Store = require('../Models/Store.model')
const Branches = require('../Models/Branches.Model')
const { StoreValidation } = require('../helpers/validation_schema')

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
    }
}

module.exports = StoreContorller