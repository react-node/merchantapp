const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
    },
    isActive:{
        type : Boolean,
        default : false
    },
    zipcode : {
        type: Number,
        required : "Zipcode is required",
        
    },
    location: {
        coordinates: [mongoose.Schema.Types.Mixed],
        type: {
            type: String,
            required : true,
            default: 'Point'
            
        },  
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    storeType : [{
        type : {type : mongoose.Schema.Types.ObjectId,ref : 'storeType'},
        categories : [Number]        

    }],
    insideMall : {type:Boolean},
    mall_name: {type : String},
    phoneNumber : {type : Number},
    email : {type:String},
    identity_proof:{type : String},
    profilepic : {type:String},
    hasMainBranch : {type : Boolean,default : false},
    mainBranchID : {type:mongoose.Schema.Types.ObjectId,default: null}
    }, {
        timestamps: true
    })

storeSchema.virtual('offers', {
    ref: 'Offers',
    localField: '_id',
    foreignField: 'storeID'
})

storeSchema.index({location: '2dsphere'}) //Index not creating. need to check other option or manually create index
const Store = mongoose.model('Store', storeSchema)

module.exports = Store