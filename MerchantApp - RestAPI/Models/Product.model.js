const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    regExp: {
        type: mongoose.Schema.Types.Mixed,
        trim: true
    },
    
    
}, {
    timestamps: true
})
const Products = mongoose.model('Products', productSchema)

module.exports = Products