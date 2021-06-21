const mongoose = require('mongoose')

const cityZipcodesSchema = new mongoose.Schema({
    
    city: {
        type: String,
        required: true
       
    },
    zipcodes: [{
        type: Number,
        required: true
       
    }],
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    popularAreas:[{
            type: String,
            required: true
           
        }]
        
}, {
    timestamps: true
})
const CityAndZipcodes = mongoose.model('CityAndZipcodes', cityZipcodesSchema)

module.exports = CityAndZipcodes