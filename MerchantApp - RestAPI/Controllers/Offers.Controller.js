const createError = require('http-errors')
const OffersModel = require('../Models/Offers.model')
const Store = require('../Models/Store.model')
const { OffersModelValidation } = require('../helpers/validation_schema')
const { request } = require('../config')

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

            const ownerID = req.payload.aud
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
        //const nearbyStores = await Store.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ -73.856077, 40.848447] }, $maxDistance: 5 * METERS_PER_MILE } } ,zipcode : 560066})
        const nearbyStores = await Store.aggregate([
            {
                $geoNear :  { near: { type: "Point", coordinates: [ 78.555312, 17.4281412] },distanceField: "distance", maxDistance: 5 * METERS_PER_MILE,spherical: true , query :{ zipcode:500076,isActive : true} }
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
    
}

module.exports = {
    "offersController" : new OffersContorller()
}