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
        default:null
    },
    orderID : {
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
    }],
    txn_status : {
        type : String,
        default:null
    },
    txn_type : {
        type : String,
        default:null
    },
    txn_gateway : {
        type : String,
        default:null
    },
    txn_response_code : {
        type : String,
        default:null
    },
    txn_res_msg : {
        type : String,
        default:null
    },
    txn_bank_name : {
        type : String,
        default:null
    },
    txn_payment_mode : {
        type : String,
        default:null
    },
    txn_refunt_amount : {
        type : String,
        default:null
    },
    txn_date : {
        type : String,
        default:null
    },
    txn_bank_id : {
        type : String,
        default:null
    },
    
}, {
    timestamps: true
})
const offerSlots = mongoose.model('OfferSlots', offerSlotSchema)

module.exports = offerSlots