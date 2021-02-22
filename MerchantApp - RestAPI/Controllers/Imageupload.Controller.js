const uploadImage = require('../helpers/gcs_helper')
const StoreImagesModel = require('../Models/StoreImages.model')
const BannerImageModel = require('../Models/BannerImages.model')

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
        const PAGE_SIZE = 6;                   // Similar to 'limit'
        const skip = (page - 1) * PAGE_SIZE; 
        const ownerID = req.payload.aud
        const storeID = req.params.storeID
      //  setTimeout(async () => {
        const storeImages = await StoreImagesModel.find({storeID: storeID,ownerID : ownerID}).sort({ _id: -1 }).skip(skip).limit(PAGE_SIZE)
        res.send(storeImages)
          
      //  }, 3000);
       
      }catch(error){
        next(error)

      }
    }
    async getBannerImage(req,res,next){
      try{
        const page = req.query.page || 1
        const ownerID = req.payload.aud
        let bannerImages = []
        if(page === "all"){
          bannerImages = await BannerImageModel.find({ownerID,isDeleted:false}).sort({ _id: -1 })
        }else{
          const PAGE_SIZE = 6;                   // Similar to 'limit'
          const skip = (page - 1) * PAGE_SIZE; 
        //  const ownerID = req.payload.aud
        //  const storeID = req.params.storeID
        //  setTimeout(async () => {
          bannerImages = await BannerImageModel.find({ownerID,isDeleted:false}).sort({ _id: -1 }).skip(skip).limit(PAGE_SIZE)
        }
        
        res.send(bannerImages)
          
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
}
module.exports = {
    "imageuploadController" : new ImageuploadController()
}