const mongoose = require('mongoose')

const assignedCitiesSchema = new mongoose.Schema({
    assignedTo : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user' 
    },
    assignedData : 
    {
        city: [{
        type: String,
        required: true
       
    }],
    zipcodes: [{
        type: Number,
        required: true
       
    }]
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    }

    
}, {
    timestamps: true
})
const assignedCities = mongoose.model('AssignedCities', assignedCitiesSchema)

module.exports = assignedCities