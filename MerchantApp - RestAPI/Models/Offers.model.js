const mongoose = require('mongoose')

const offersSchema = new mongoose.Schema({
    offerName: {
        type: String,
        required: true,
        trim: true
    },
    offerDescription: {
        type: String,
        trim: true
    },
    fromDate: {
        type: Date,
        required: true,
    },
    expireDate:{
        type : Date,
        required : true
    },
    discountType : {
        type: String,
        required : "Discount type is required",
        
    },
    discount : {
        type: Number,
        required : "Discount is required",
        
    },
    storeID: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store'
    }],
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    groupOfStoresByUID:{
        type:String,
      
        default: new Date().getTime()
    },
    likes : {
        type: Number,
        default:0
    },
    views : {
        type: Number,
        default:0
    },
    shares : {
        type: Number,
        default:0
    },
    isActive : {
        type: Boolean,
        default:false
    },
    isDeleted : {
        type: Boolean,
        default:false
    },
    status:{
        type:Number,
        default : 1 //1=submitted,2-approved,3-rejected
    },
    deletedSourceStoreID : {
        type: String,
        default: null
        
    },
    images:  [{
        imagePath : {type : String},
        isDeleted : {type: Boolean,default:false}
    }]
    
}, {
    timestamps: true
})
const Offers = mongoose.model('Offers', offersSchema)

module.exports = Offers