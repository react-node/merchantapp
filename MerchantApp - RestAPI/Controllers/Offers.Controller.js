const createError = require('http-errors')
const OffersModel = require('../Models/Offers.model')
const Store = require('../Models/Store.model')
const { OffersModelValidation } = require('../helpers/validation_schema')
const UsersMetaData = require('../Models/UsersMetaData.model')
const mongoose = require('mongoose')


class OffersContorller {
    async addOffers(req, res, next){
        try {
            const ownerID = req.payload.aud
            let requestPayload = req.body.map((data)=>({...data,ownerID}))
        
          // requestPayload.ownerID = ownerID
            console.log(req.body)
           // const mainOffer = {name: requestPayload[0].offerName, groupOfStoresByUID : requestPayload[0].groupOfStoresByUID}
            const result = await OffersModelValidation.validateAsync(requestPayload)
            const offersData = await OffersModel.insertMany(result)
           // const offersData_result = await offersData.()
            res.send(offersData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    async updateOffers(req, res, next){
        try {
            const ownerID = req.payload.aud
            let requestPayload = req.body.map((data)=>({...data,ownerID}))
        
          // requestPayload.ownerID = ownerID
           // console.log(req.body)
           // const mainOffer = {name: requestPayload[0].offerName, groupOfStoresByUID : requestPayload[0].groupOfStoresByUID}
            const result = await OffersModelValidation.validateAsync(requestPayload)
            Promise.all(
                result.map(async (data)=>{
                    console.log(data)
                    let response =''

                    if(data._id){
                        if(data.EditOfferID && data.editFromStoreID){
                            const {_id,EditOfferID,editFromStoreID,...reqdata} = data
                            reqdata.storeID= [editFromStoreID]
                            const newRecord= new OffersModel(reqdata)
                            response = await newRecord.save()
                           const filteredStores = data.storeID.filter((store)=> store !== editFromStoreID)
                           data = {_id,storeID:filteredStores}
                        }
                        //const response= await OffersModel.findOneAndUpdate({_id:data._id},data,{new:true,upsert:true,setDefaultsOnInsert:true})
                        response= await OffersModel.findOneAndUpdate({_id:data._id},data,{new:true})

                    }
                return response
                
            })).then((res)=>{
                res.send(res)
            }).catch((e)=>{
                res.send(e)
            })
            
        
           // const offersData_result = await offersData.()
            
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    async getOffers(req, res, next){
        try {
            const storeID = req.query.storeid || ''
            const filter = req.query.searchstring || null
            const filterType = req.query.type || null
            
            const ownerID = Array.isArray(req.payload.aud) ?  req.payload.aud[1] : req.payload.aud
            const page = parseInt(req.query.page) || 1
            const PAGE_SIZE = parseInt(req.query.pagesize) || 9;                   // Similar to 'limit'
            const skip = (page - 1) * PAGE_SIZE; 
            let query = {ownerID,  isDeleted:false}
            if(storeID) {
                query.storeID = storeID
                delete query.ownerID
            }
            if(filterType === "offerName"){
                const queryString = `${filter}`
                
              const regex = new RegExp(queryString, 'i')
                console.log(queryString)
                query.offerName = {$regex: regex}
              }
              console.log(query)
            const count = await OffersModel.countDocuments(query)
            const offersData = await OffersModel.find(query).sort({ _id: -1 }).skip(skip).limit(PAGE_SIZE)
            const filteredImagesData = offersData.map((item,k)=>{
                const x= {...item}
                const Images=  item.images.filter((img,k)=> !img.isDeleted )
                item.images=Images
                return item

            })
            
            // const offersData = await OffersModel.aggregate([{
            //     $group:{
            //       _id:"$groupOfStoresByUID" ,
            //       Files:{
            //           $push:"$$ROOT"
            //       } 
            //     }
            // },
            //     {
            //         $skip : skip
            //     },{
            //         $limit : PAGE_SIZE
            //     },{
            //         $sort: {
            //             "_id" : -1
            //         }
            //     }
            // ])
            res.send({offersData :filteredImagesData,count})
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    async getstoresAndOffers(req, res, next){
        const METERS_PER_MILE = 1609.34
        var filter ={}
        if(!req.query.zipcode) throw createError.UnprocessableEntity()
        const zipcode = parseInt(req.query.zipcode)
        
        filter = {zipcode}
        const categoryID = req.query.categoryID
        const categoryType = req.query.categoryType
        if(categoryID) filter.storeType = {$elemMatch: {type : categoryID}}
        if(categoryType) filter.storeType.$elemMatch.categories = categoryType
   
        const latAndLong= req.query.geocode.split(',')
        const lat = parseFloat(latAndLong[0])
        const lng = parseFloat(latAndLong[1])
        const page = parseInt(req.query.page) || 1
        const PAGE_SIZE = parseInt(req.query.pagesize) || 10;                   // Similar to 'limit'
        const skip = (page - 1) * PAGE_SIZE; 
        console.log(lat,lng)
        // const nearbyStores = await Store.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ lat,lng] },$maxDistance: 5 * METERS_PER_MILE }} ,zipcode : zipcode}).distinct('_id')
        // const offers = await OffersModel.find({storeID : {$in: nearbyStores}})
        const nearbyStores = await Store.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ lat,lng] },$maxDistance: 5 * METERS_PER_MILE }} ,...filter}).populate({path:"offers",match: { isActive:true }}).skip(skip).limit(PAGE_SIZE)
        // const nearbyStores = await Store.aggregate([
        //     {
        //         $geoNear :  { near: { type: "Point", coordinates: [lat,lng] },distanceField: "distance", maxDistance: 5 * METERS_PER_MILE,spherical: true , query :{ zipcode:zipcode,isActive : true} }
        //     },{
        //         $skip : skip
        //     },{
        //         $limit : PAGE_SIZE
        //     },{
        //         $sort : {distance : -1}
        //     },{
        //     $lookup: {
        //             from: "offers",
        //             localField: "_id",
        //             foreignField: "storeID",
        //             as: "offers",
        //         },
        // },
        // {
        //     "$addFields": {
        //         "offers": {
        //             "$filter": {
        //               "input": "$offers",
        //               "cond": { "$eq": ["$$this.isActive", true] }
        //             }
        //           }
        //     }   
        // }])
        //setTimeout(() => {
            res.send(nearbyStores)
        //}, 2000);
        
    }
    async deleteOffer(req, res, next){
        try {
            const offerID = req.params.offerID
            const storeid = req.query.storeid || null
            let offerResult = ""
            let updateData = {isDeleted:true}
            if(storeid){
                const offerData = await OffersModel.findById(offerID).lean()
                console.log("storeid====",storeid)
                const {_id,...rest} = offerData
                if(offerData.storeID.length >1){
                    const requestBody = {...rest,isDeleted:true,deletedSourceStoreID: storeid}
                    console.log(requestBody)
                    const newRecord = new OffersModel(requestBody)
                    await newRecord.save() //async operation
                    const filteredStores = offerData.storeID.filter((i) => i != storeid)
                   
                    updateData = {storeID : filteredStores}
                   // offerResult = await OffersModel.findByIdAndUpdate(offerID,{isDeleted:true,storeID:filteredStores})

                }
                // else{
                //     offerResult = await OffersModel.findByIdAndUpdate(offerID,{isDeleted:true})

                // }
            }
            // else{
            //      offerResult = await OffersModel.findByIdAndUpdate(offerID,{isDeleted:true})
            // }
            offerResult = await OffersModel.findByIdAndUpdate(offerID,updateData)
            if(!offerResult){
                return next(createError.NotFound)
            }

            
            res.send(offerResult)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }

    }
    async getstoresbyoffer(req, res, next){
        try {
            const storeids = req.body
            const storeResult = await Store.find({'_id': {'$in' : storeids}}).select("_id name address zipcode")
            if(!storeResult){
                return next(createError.NotFound)
            }
            res.send(storeResult)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }

    }
    async getAllOffers(req, res, next){
        try {
            const ownerID = req.payload.aud
            const offersResult = await OffersModel.find({ownerID,isDeleted:false}).select("_id offerName storeID isActive status createdAt")
            if(!offersResult){
                return next(createError.NotFound)
            }
            res.send(offersResult)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }

    }
    async getOfferByZipcodes(req, res, next){
        try{
            const page = req.query.page || 1
            const filter = req.query.searchstring || null
            const userType = parseInt(req.query.userType) || 3
            const filterType = req.query.type || null
            const zipcodes = req.query.zipcodes || null
            const ORDERBY = req.query.orderBy || "_id";
            const ORDER = req.query.order === "asc" ? 1 : -1;
            const status = parseInt(req.query.status);
            const PAGE_SIZE = parseInt(req.query.pagesize) || 5;                   // Similar to 'limit'
            const skip = (page - 1) * PAGE_SIZE; 
            const fromDate = req.query.fromDate;
            const toDate = req.query.toDate;
           
            let query = { isDeleted:false}
            if(userType === 3) query.owner = req.payload.aud
            if(userType === 2) {
              let zipcodesArray = []
              if(zipcodes){
                zipcodesArray = zipcodes.split(",")
                let storeQuery = { isDeleted: false,zipcode: { '$in': zipcodesArray}}
                if(filterType === "string"){
                let regex = new RegExp(filter,'i')
                storeQuery.name = regex

                }
                const ownersList = await Store.distinct('owner',storeQuery)
                // console.log(ownersList)
                // let ownerIds = ownersList.map(({owner})=>{
                //   return owner
                //   // if(!ownerIds.includes(owner)){
                //   //   ownerIds.push(owner)
                //   //  }
                //   })
                console.log(ownersList)
    
                query.ownerID = {$in : ownersList}
              }
              
              //query.zipcode = {$in : zipcodesArray}
            }
            if(fromDate && toDate){
              query.createdAt = { $gte: fromDate, $lte: toDate + "T23:59:59" }
            }else if(fromDate) {
              query.createdAt = { $gte: fromDate }
            }else if(toDate) {
              query.createdAt = { $lte: toDate + "T23:59:59"  }
            }
            if(status) query.status = status
            const count = await OffersModel.countDocuments(query)
            const offersData = await OffersModel.find(query).sort({[ORDERBY]: ORDER }).skip(skip).limit(PAGE_SIZE)
            
            res.send({offersData,count})
              
          //  }, 3000);
           
          }catch(error){
            next(error)
    
          }
    }
    async getOfferBYID(req, res, next){
        try {
            const offerID = req.params.offerID
            const result  = await OffersModel.findById(offerID)
            if(!result){
                return next(createError.NotFound)
            }
            res.send(result)
        } catch (error) {
            next(error)
        }

    }
    async updateOffersInfo(req,res,next){
        try{
          const id = req.params.offerID
          const requestBody = req.body
          const offerData = await OffersModel.findByIdAndUpdate(id,requestBody,{new : true} )
          res.send(offerData)
        }catch(error){
          next(error)
        }
    }
    async updateOffersMetaData(req,res,next){
        try{
          const id = req.params.offerID
          const requestBody = req.body
          const metdaDataType = Object.keys(requestBody)[0]
          const userID = Array.isArray(req.payload.aud) ? req.payload.aud[1] : req.payload.aud
          const userMetaData = await UsersMetaData.findOne({userID : userID})
          if(userMetaData ){
            if(userMetaData[metdaDataType].includes(id)){
                throw createError.Conflict()
            }else{
                //update record
                await UsersMetaData.updateOne({userID},{$push : {[metdaDataType] : id}})
            }
          }else{
              //insert new records
              const data = {
                  userID,
                  [metdaDataType] : [id]
              }
              const newReocrd = new UsersMetaData(data)
              await newReocrd.save()
          }   
          const offerData = await OffersModel.findByIdAndUpdate(id,{$inc:requestBody},{new : true} )
          res.send(offerData)
        }catch(error){
          next(error)
        }
    }
    async getStoresBySearch(req,res,next){
        try {
            const ObjectId = mongoose.Types.ObjectId;
            const id = req.query.id
            const type = req.query.type
            const category = req.query.category //category index. add in query.
            const page = parseInt(req.query.page) || 1
            const PAGE_SIZE = parseInt(req.query.pagesize) || 10;                   // Similar to 'limit'
            const skip = (page - 1) * PAGE_SIZE; 
            const latAndLong= req.query.geocode.split(',')
            const lat = parseFloat(latAndLong[0])
            const lng = parseFloat(latAndLong[1])
            var filter ={}
            var matchCriteria = {
                storeID : ObjectId(id),
                isActive : true
            }
            if(type==="store"){
                filter._id = ObjectId(id)
            }else if(type==="mall"){
                filter = {
                    mall_name : id
                }
            }else if(type==="category"){
                filter = {
                    storeType :{
                        $elemMatch :{
                            type : ObjectId(id)


                        }
                    }
                }
                matchCriteria ={
                        $expr: { $in: [  "$$x","$storeID" ] },
                        isActive : true
                }

            }else{
                throw createError.NotAcceptable()
            }
            const stores = await Store.aggregate([
                {
                    $geoNear :  { near: { type: "Point", coordinates: [lat,lng] },distanceField: "distance", spherical: true , query : filter}
                },{
                    $skip : skip
                },{
                    $limit : PAGE_SIZE
                },{
                    $sort : {
                        distanceField : -1
                    }
                },{
                    $lookup: {
                    from: "offers", 
                    let: { x: "$_id"},
                    // localField: "_id",
                    // foreignField: "id",
                    pipeline:[{
                        $match : matchCriteria,
                      },
                      {
                        $sort :{
                            distance : -1
                        }
                      },{
                          $project :{
                            images:1,
                            offerName: 1,
                            offerDescription: 1,
                            discountType: 1,
                            discount: 1,
                            _id:1,
                            ownerID:1
                          }
                      }
                    ],
                    as: "offers",
                    }
                },
                {
                    $project:{
                        name:1,
                        area:1,
                        address:1,
                        city:1,
                        offers: 1,
                        distanceField:1
                    }
                }
            ])
            //const stores = await Store.findById(storeID).populate({path:"offers",match: { isActive:true }})
            res.send(stores)

        } catch (error) {
            next(error)
        }
    }
    async getstoresAndOffersBySearch(req, res, next){
        const METERS_PER_MILE = 1609.34
        var filter ={isActive : true}
        
        const categoryID = req.query.categoryID
        const categoryType = req.query.categoryType
        const searchString = req.query.searchString
        if(categoryID) filter.storeType = {$elemMatch: {type : categoryID}}
        if(categoryType) filter.storeType.$elemMatch.categories = categoryType
        if(searchString){
            const regex = new RegExp(searchString, 'i')
            filter.name = regex
        } 
        const latAndLong= req.query.geocode.split(',')
        const lat = parseFloat(latAndLong[0])
        const lng = parseFloat(latAndLong[1])
        const page = parseInt(req.query.page) || 1
        const PAGE_SIZE = parseInt(req.query.pagesize) || 10;                   // Similar to 'limit'
        const skip = (page - 1) * PAGE_SIZE; 
        console.log(lat,lng)
        // const nearbyStores = await Store.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ lat,lng] },$maxDistance: 5 * METERS_PER_MILE }} ,zipcode : zipcode}).distinct('_id')
        // const offers = await OffersModel.find({storeID : {$in: nearbyStores}})
        // const nearbyStores = await Store.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ lat,lng] },$maxDistance: 5 * METERS_PER_MILE }} ,...filter}).populate({path:"offers",match: { isActive:true }}).skip(skip).limit(PAGE_SIZE)
        const nearbyStores = await Store.aggregate([
            {
                $geoNear :  { near: { type: "Point", coordinates: [lat,lng] },distanceField: "distance", spherical: true , query :{ isActive : true} }
            },{
                $skip : skip
            },{
                $limit : PAGE_SIZE
            },{
                $sort : {distance : -1}
            },{
                $lookup: {
                from: "offers", 
                let: { id: "$_id"},
                // localField: "_id",
                // foreignField: "storeID",
                pipeline:[{
                    $match :{
                        $expr: { $in: [  "$$id","$storeID" ] },
                        isActive : true
                    },
                  },
                  {
                    $sort :{
                        _id : -1
                    }
                  },{
                      $project :{
                        images:1,
                        offerName: 1,
                        offerDescription: 1,
                        discountType: 1,
                        discount: 1,
                        _id:1,
                        ownerID:1
                      }
                  }
                ],
                as: "offers",
                }
            },
        ])
       // setTimeout(() => {
            res.send(nearbyStores)
       // }, 2000);
        
    }
    
}

module.exports = {
    "offersController" : new OffersContorller()
}