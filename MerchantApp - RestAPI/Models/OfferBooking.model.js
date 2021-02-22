const mongoose = require('mongoose')

const offerSlotSchema = new mongoose.Schema({
    
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    offerDetails : {
        name : {
            required : true,
            type : String
        },
        id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Offers' 
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
const offerSlots = mongoose.model('OfferSlots', offerSlotSchema)

module.exports = offerSlots