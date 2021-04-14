const mongoose = require('mongoose')

const storeImagesSchema = new mongoose.Schema({
    
    storeID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store'
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    isApproved : {
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
    image:  String
    
}, {
    timestamps: true
})
const Offers = mongoose.model('StoreImages', storeImagesSchema)

module.exports = Offers