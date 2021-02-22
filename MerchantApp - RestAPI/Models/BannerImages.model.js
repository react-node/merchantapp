const mongoose = require('mongoose')

const bannerImagesSchema = new mongoose.Schema({
    
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    isApproved : {
        type: Number,
        default : 1
    },   
    isDeleted : {
        type: Boolean,
        default : false
    },   
    imagePath:  String
    
}, {
    timestamps: true
})
const Offers = mongoose.model('BannerImages', bannerImagesSchema)

module.exports = Offers