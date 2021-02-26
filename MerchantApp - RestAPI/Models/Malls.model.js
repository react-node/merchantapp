const mongoose = require('mongoose')

const mallsSchema = new mongoose.Schema({
    
    mallName: {
        type: String,
        required: true
       
    },
    area: {
        type: String,
        required: true
       
    },
    city: {
        type: String,
        required: true
       
    },
    state: {
        type: String,
        required: true
       
    },
    country: {
        type: String,
        required: true
       
    },
    google_place_id : {
        type: String,
        default : null
    },
    zipcode:{
        type:Number,
        required:true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    }

    
}, {
    timestamps: true
})
const Malls = mongoose.model('Malls', mallsSchema)

module.exports = Malls