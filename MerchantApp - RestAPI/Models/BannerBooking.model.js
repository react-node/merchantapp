const mongoose = require('mongoose')

const bannerSlotSchema = new mongoose.Schema({
    
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    bannerDetails : {
        imagePath : {
            required : true,
            type : String
        },
        id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'BannerImages' 
        }
    },
    transactionID : {
        type:String,
        required: true
    },
    totalPaid:{
        type:Number,
        required: true
    },
    selectStores:[{
        zipcode:{
            type : Number,
            required : true
        },
        id:{
            type : mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Store' 
        },
        selectedDates:[{
            type: Date,
            required:true
        }]
    }]
    
}, {
    timestamps: true
})
const bannerSlots = mongoose.model('BannerSlots', bannerSlotSchema)

module.exports = bannerSlots