const mongoose = require('mongoose')

const storeTypeSchema = new mongoose.Schema({
    type : {type : String,required:true},
    categories : [String]

    }, {
    timestamps: true
})
const Store = mongoose.model('StoreType', storeTypeSchema)

module.exports = Store