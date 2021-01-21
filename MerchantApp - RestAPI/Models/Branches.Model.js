const mongoose = require('mongoose')

const branchsSchema = new mongoose.Schema({
    
    storeID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    branches:  [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store',
        default : []
    }]
    
}, {
    timestamps: true
})
const Offers = mongoose.model('Branches', branchsSchema)

module.exports = Offers