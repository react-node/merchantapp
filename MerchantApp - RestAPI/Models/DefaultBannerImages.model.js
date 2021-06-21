const mongoose = require('mongoose')

const defaultBannerImagesSchema = new mongoose.Schema({
    
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    isApproved : {
        type: Boolean,
        default : false
    },   
    isDeleted : {
        type: Boolean,
        default : false
    },
    id:{
        type : Number,
        required:true
    },
    rejectedMessage:{
        type: String,
        default:null
    },
    imagePath:  String
    
}, {
    timestamps: true
})
const defaultBannerImages = mongoose.model('DefaultBannerImages', defaultBannerImagesSchema)

module.exports = defaultBannerImages