const mongoose = require('mongoose')

const bannerImagesSchema = new mongoose.Schema({
    
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
    status:{
        type : Number,
        default : 1 // 1- submitted 2- approved 3- rejected
    },
    rejectedMessage:{
        type: String,
        default:null
    },
    imagePath:  String
    
}, {
    timestamps: true
})
const bannerImages = mongoose.model('BannerImages', bannerImagesSchema)

module.exports = bannerImages