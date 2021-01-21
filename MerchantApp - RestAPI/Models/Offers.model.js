const mongoose = require('mongoose')

const offersSchema = new mongoose.Schema({
    offerName: {
        type: String,
        required: true,
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
        type: String,
        required : "Discount is required",
        
    },
    storeID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store'
    },
    likes : {
        type: Number
    },
    shares : {
        type: Number
    },
    isActive : {
        type: Boolean
    },
    images:  [String]
    
}, {
    timestamps: true
})
const Offers = mongoose.model('Offers', offersSchema)

module.exports = Offers