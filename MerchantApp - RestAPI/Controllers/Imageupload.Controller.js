const uploadImage = require('../helpers/gcs_helper')

class ImageuploadController{

    async uploadImage(req,res,next){
        try {
            const myFile = req.file
            const userID = req.payload.aud
            const imageUrl = await uploadImage(myFile,userID)
            res
              .status(200)
              .json({
                message: "Upload was successful",
                data: imageUrl
              })
          } catch (error) {
            next(error)
          }
    }
}
module.exports = {
    "imageuploadController" : new ImageuploadController()
}