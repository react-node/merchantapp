const createError = require('http-errors')
const BannerBooking = require('../Models/BannerBooking.model')
const OfferBooking = require('../Models/OfferBooking.model')
const { SlotBookingValidation ,OfferSlotBookingValidation} = require('../helpers/util_validation_schema')
const defaultBannerImages = require('../Models/DefaultBannerImages.model')
const Offers = require('../Models/Offers.model')
const Store = require('../Models/Store.model')



class SlotBookingController {
    async saveBookingInfo(req){
        try {
        //   const ownerID = req.payload.aud
        //   const requestData = {...req.body,ownerID}
          const validationResult = await SlotBookingValidation.validateAsync(req)

          const saveData = new BannerBooking(validationResult)
          const result =await saveData.save()
          return result

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            throw error
        }
    }
    async searchBannerSlots (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            console.log(zipcodes)
            const SlotsAvailability = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate},zipcode:{$in:zipcodes}}},txn_response_code:"01"}).select("selectStores")
            res.send(SlotsAvailability)
            
        } catch (error) {
            next(error)
        }
    }
    async searchOfferSlots (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            console.log(zipcodes)
            const SlotsAvailability = await OfferBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate},zipcode:{$in:zipcodes}}},txn_response_code:"01"}).select("selectStores")
            res.send(SlotsAvailability)

            
        } catch (error) {
            next(error)
        }
    }
    async getOffersHistory (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            var filter = {ownerID}
            if(req.body.offer){
                filter['offerDetails.id'] = req.body.offer._id

            }
           // const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            //console.log(zipcodes)
            const offersHistory = await OfferBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate}}},...filter}).populate("offerDetails.id","offerName fromDate expireDate discount isActive isDeleted")
            // below query will return offer data if query match otherwise it return null in if column. will get the booking data
            // const offersHistory = await OfferBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate}}},ownerID}).populate({path : "offerDetails.id",
            //     match :{isDeleted : false},
            //     select : "offerName fromDate expireDate discount isActive isDeleted"})
            res.send(offersHistory)
        } catch (error) {
            next(error)
        }
    }
    async getBannerHistory (req,res,next){
        try {
            const ownerID = req.payload.aud
            const fromDate = req.body.fromDate
            const toDate = req.body.toDate
            var filter = {ownerID}
            if(req.body.banner){
                filter['bannerDetails.id'] = req.body.banner._id

            }
           // const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            //console.log(zipcodes) 
           // console.log({...filter})
            const bannerHistory = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate}}},...filter}).populate("bannerDetails.id","imagePath isApproved isDeleted")
            
            // below query will return offer data if query match otherwise it return null in if column. will get the booking data
            // const bannerHistory = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : fromDate, $lte: toDate}}},...filter}).populate({path : "bannerDetails.id",
            //     match :{isDeleted : false},
            //     select : "imagePath isApproved isDeleted"})
            res.send(bannerHistory)
        } catch (error) {
            next(error)
        }
    }
    async getBanners (req,res,next){
        try {
            let ts = Date.now();

            let date_ob = new Date(ts);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            if(month < 10){
                month="0"+month
            }
            if(date < 10){
                date="0"+date
            }
            let year = date_ob.getFullYear();
            const fromDate = year + "-" + month + "-" + date+"T00:00:00.000+00:00"
            const toDate = year + "-" + month + "-" + date+"T23:59:59.000+00:00"
            // const fromDate = new Date()
            // const toDate = new Date()
            // prints date & time in YYYY-MM-DD format
            console.log(fromDate,toDate,date_ob);

            const zipcode = req.query.zipcode
            console.log(zipcode)
            if(!zipcode) throw createError.UnprocessableEntity()
            var filter = {}
            // if(req.body.banner){
            //     filter['bannerDetails.id'] = req.body.banner._id

            // }
           // const zipcodes = req.body.selectStore.map(({zipcode})=> zipcode)
            //console.log(zipcodes) 
           // console.log({...filter})
            const banners = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : new Date(fromDate), $lte: new Date(toDate)},zipcode:zipcode}}}).populate("bannerDetails.id","imagePath isApproved isDeleted ").select("orderID ownerID -_id")
           
            // const banners = await BannerBooking.aggregate([
            //     {
            //         $match:{
            //             condition : {
            //                 selectStores:{$elemMatch:{selectedDates : {$gte : new Date(fromDate), $lte: new Date(toDate)},zipcode:zipcode}}
            //             }
            //         }
            //     },
            //     { $lookup:
            //         {
            //           from: 'bannerimages',
            //           localField: 'bannerDetails.id',
            //           foreignField: '_id',
            //           as: 'banners'
            //         }
            //       }
            // ])
            // if(banners.length>0 && banners.length < 5){
            //     //assign other banner images randomly based on near by location
                

            // }
            let defaultImage =[]
            if(banners.length>=0 && banners.length < 5){
                //Default banners
                const limit = 5 - banners.length
                defaultImage = await defaultBannerImages.find().limit(limit)

            }
           // console.log(defaultImage)
            // below query will return offer data if query match otherwise it return null in if column. will get the booking data
            // const banners = await BannerBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : new Date(fromDate), $lte: new Date(toDate)}}},...filter}).populate({path : "bannerDetails.id",
            //     match :{isDeleted : true},
            //     select : "imagePath isApproved isDeleted",
            //      projects: {$push: "$$ROOT"}})
            res.send({banners,defaultImage})
        } catch (error) {
            next(error)
        }
    }
    async getOffers (req,res,next){
        try {
            let ts = Date.now();

            let date_ob = new Date(ts);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            if(month < 10){
                month="0"+month
            }
            if(date < 10){
                date="0"+date
            }
            let year = date_ob.getFullYear();
            const fromDate = year + "-" + month + "-" + date+"T00:00:00.000+00:00"
            const toDate = year + "-" + month + "-" + date+"T23:59:59.000+00:00"
            // const fromDate = new Date()
            // const toDate = new Date()
            // prints date & time in YYYY-MM-DD format
            console.log(fromDate,toDate,date_ob);

            const zipcode = req.query.zipcode
            if(!zipcode) throw createError.UnprocessableEntity()
            console.log(zipcode)
            var filter = {}
           
            const offers = await OfferBooking.find({selectStores:{$elemMatch:{selectedDates : {$gte : new Date(fromDate), $lte: new Date(toDate)},zipcode:zipcode}}})
            .populate("offerDetails.id","offerName offerDescription likes shares views storeID isDeleted images")
            .populate("selectStores.id","name zipcode profilepic")
            .select("orderID offerDetails selectStores ownerID -_id")
            let paidOffers = []
            let paidOfferids = []
            offers.forEach(item=>{
                const {images,offerName, offerDescription, views, likes, shares,storeID,  _id} = item.offerDetails.id
                paidOfferids.push(_id)
                var mainObj = {
                    orderID : item.orderID,
                    ownerID : item.ownerID
                }
                paidOffers = item.selectStores.map(x=>{
                    mainObj = {...mainObj,images,offerName,offerDescription,storeID,views,likes,shares,_id,storeDetails : x.id}
                    return mainObj
                })
            })
            let defaultOffers =[]
            let storeOffers = []
            if(paidOffers.length>=0 && paidOffers.length < 3){
                //Default banners
                const limit = 3 - paidOffers.length
                
                 const stores = await Store.aggregate([
                    {
                        $match : {
                            zipcode : parseInt(zipcode),
                        
                        }
    
                    }, 
                    {
                    $sample :{size: limit}
                }])
                const storeids = stores.map(item=>{
                    return item._id
                })
                console.log(storeids)
                 defaultOffers = await Offers.find({
                    _id:{$nin : paidOfferids},
                    storeID:{$in : storeids},
                    // isActive : true,
                    // isDeleted:false,
                    

                }).select("offerName offerDescription orderID storeID ownerID images likes shares views").sort({"updatedAt":-1}).limit(limit)
                const offersArray = JSON.parse(JSON.stringify(defaultOffers))
                const storesArray = JSON.parse(JSON.stringify(stores))
                storeOffers =storesArray.map((item)=>{

                   const storeOffer = offersArray.find(x=> x.storeID.includes(item._id) )
                  // item.offer = storeOffer
                   let newObj = {...storeOffer,storeDetails:{...item}}
                  // newObj.storeDetails = {...item}
                   
                   return newObj
                })
                //console.log(offers)
                //find random store and offer to display in slides on home screen
                //  defaultOffers = await Store.aggregate([
                //     {
                //         $match : {
                //             zipcode : parseInt(zipcode)
                //         }
    
                //     }, 
                //     {
                //     $lookup: {
                //             from: "offers",
                //             as: "match_offers",
                //             // let: {
                //             //     'id': '$_id'
                //             //   },
                //             //   'pipeline': [{
                //             //       '$match': { '$expr': { '$eq': ['$$id','$storeID'] } }
                //             //     },{
                //             //       '$limit': 10
                //             //     },
                //             //   ],
                //             localField: "_id",
                //             foreignField: "storeID",
                           
                //         },
                        
                // },
                
                // //{ "$unwind": "$offers" },
                // // {
                // //     $sample : {size : limit}
                // // }
                // ])

            }
         
            res.send({paidOffers,defaultOffers,storeOffers})
        } catch (error) {
            next(error)
        }
    }
    async saveOfferBookingInfo(req){
        try {
        //   const ownerID = req.payload.aud
        //   const requestData = {...req.body,ownerID}
          const validationResult = await OfferSlotBookingValidation.validateAsync(req)

          const saveData = new OfferBooking(validationResult)
          const result =await saveData.save()
          //res.send(result)
          return result

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            //next(error)
            throw error
        }
    }
    async updateBookingTXNID(req,slotType){
        try {
            const {orderID,...rest} = req
            let update_txn_data = []
            if(slotType === "banner"){
                 update_txn_data = await BannerBooking.findOneAndUpdate({orderID },rest)
            }else{
                 update_txn_data = await OfferBooking.findOneAndUpdate({orderID },rest)

            }
            return update_txn_data

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            //next(error)
            return error
        }
    }
    async getOrderDetails(orderID,type){
        try {
            let orderData =[] 
            if(type === "banner"){
                orderData = await BannerBooking.findOne({orderID })
            }else{
                orderData = await OfferBooking.findOne({orderID })

            }
            console.log(type, orderData)
            return orderData

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            //next(error)
            return error
        }
    }

}

module.exports = {
    "SlotBookingController" : new SlotBookingController()
}