const uploadImage = require('../helpers/gcs_helper')
const StoreImagesModel = require('../Models/StoreImages.model')
const BannerImageModel = require('../Models/BannerImages.model')
const DefaultBanners = require('../Models/DefaultBannerImages.model')
const Store = require('../Models/Store.model')

class ImageuploadController{

    async uploadImage(req,res,next){
        try {
            const myFile = req.file
            const userID = req.payload.aud
            const imagePath = req.body.filePath || ""
            //console.log(req)
            const imageUrl = await uploadImage(myFile,userID,imagePath)
            res
              .status(200)
              .json({
                message: "Upload was successful",
                data: imageUrl
              })
          } catch (error) {
            console.log(error)
            next(error)
          }
    }
    async updateStoreImages (req,res,next){
      try{
       
        let requestBody = req.body
        let ids = requestBody.selectedIds
        delete requestBody.selectedIds
        console.log(ids)
        console.log(requestBody)
        const storeID = req.params.storeID

        const query ={_id :{$in : ids}, storeID }
       const UpdateResult = await StoreImagesModel.updateMany(query,requestBody,{new:true})
        //const storeImageData = await storeImage.insertMany()
        res.send(UpdateResult)
      }catch(error){
        next(error)

      }
    }
    async saveStoreImage (req,res,next){
      try{
        const ownerID = req.payload.aud
       // req.body.ownerID = userID
        let requestBody = req.body
        requestBody = requestBody.map(data=>({...data, ownerID}))
        console.log(requestBody)
        const storeImageData = await StoreImagesModel.insertMany(requestBody)
        //const storeImageData = await storeImage.insertMany()
        res.send(storeImageData)
      }catch(error){
        next(error)

      }
    }
    async saveBannerImage (req,res,next){
      try{
        const ownerID = req.payload.aud
       // req.body.ownerID = userID
        let requestBody = {...req.body,ownerID}
       
        console.log(requestBody)
        const bannerImageData = new BannerImageModel(requestBody)
        const result = await bannerImageData.save()
        //const storeImageData = await storeImage.insertMany()
        res.send(result)
      }catch(error){
        next(error)

      }
    }
    async getStoreImage(req,res,next){
      try{
        const page = req.query.page || 1
        const userType = req.query.type || 3
        const status = parseInt(req.query.status) || 0
        const PAGE_SIZE = 7;                   // Similar to 'limit'
        const skip = (page - 1) * PAGE_SIZE; 
        const ownerID = req.payload.aud
        const storeID = req.params.storeID
        let query = {storeID}
        if(status) query.status = status
        if(userType === 3)  query.ownerID = ownerID 
        //setTimeout(async () => {
        const storeImages = await StoreImagesModel.find(query).sort({ _id: -1 }).skip(skip).limit(PAGE_SIZE)
        res.send(storeImages)
          
       // }, 3000);
       
      }catch(error){
        next(error)

      }
    }
    async getBannerImage(req,res,next){
      try{
        const page = req.query.page || 1
        const ownerID = req.payload.aud
        const userType = parseInt(req.query.userType) || 3
        let query = {isDeleted:false}
        if(userType === 3 ){
          query.ownerID = ownerID
        }
        let bannerImages = []
        if(page === "all"){
          bannerImages = await BannerImageModel.find(query).sort({ _id: -1 })
        }else{
          const PAGE_SIZE = 6;                   // Similar to 'limit'
          const skip = (page - 1) * PAGE_SIZE; 
        //  const ownerID = req.payload.aud
        //  const storeID = req.params.storeID
        //  setTimeout(async () => {
          bannerImages = await BannerImageModel.find(query).sort({ _id: -1 }).skip(skip).limit(PAGE_SIZE)
        }
        
        res.send(bannerImages)
          
      //  }, 3000);
       
      }catch(error){
        next(error)

      }
    }
    async getBannerImageByZipcodes(req,res,next){
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
            console.log(storeQuery)
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
        const count = await BannerImageModel.countDocuments(query)
        const bannerImages = await BannerImageModel.find(query).sort({[ORDERBY]: ORDER }).skip(skip).limit(PAGE_SIZE)
        
        res.send({bannerImages,count})
          
      //  }, 3000);
       
      }catch(error){
        next(error)

      }
    }
    async deleteBannerImage(req,res,next){
      try{
        const ownerID = req.payload.aud
        const BannerImages = await BannerImageModel.updateMany({_id:{'$in':req.body},ownerID},{isDeleted : true})
        res.send(BannerImages)
      
       
      }catch(error){
        next(error)

      }
    }
    async getBannerInfo(req,res,next){
      try{
        const id = req.params.bannerID
        const BannerImages = await BannerImageModel.findById(id)
        res.send(BannerImages)
      
       
      }catch(error){
        next(error)

      }
    }
    async updatebannerInfo(req,res,next){
      try{
        const id = req.params.bannerID
        const requestBody = req.body
        const BannerImage = await BannerImageModel.findByIdAndUpdate(id,requestBody,{new : true} )
        res.send(BannerImage)
      
       
      }catch(error){
        next(error)

      }
    }
    async updateDefaultBannerInfo(req,res,next){
      try{
        const id = req.params.bannerID
        if(id > 5){
          throw new Error("ID value should be less than 6")
        }
        const ownerID = req.payload.aud
        const requestBody = {ownerID,...req.body}
        console.log(requestBody)
        const BannerImage = await DefaultBanners.findOneAndUpdate({id},requestBody,{new : true} )
        if(!BannerImage){
          const model = new DefaultBanners({...requestBody,id})
          const result = await model.save()
          res.send(result)
          return 
        }
        res.send(BannerImage)
      }catch(error){
        next(error)
      }
    }
}
module.exports = {
    "imageuploadController" : new ImageuploadController()
}