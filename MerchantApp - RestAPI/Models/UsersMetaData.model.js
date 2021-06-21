const mongoose = require('mongoose')

const userMetaDataSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'endusers'
    },
    
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Offers'
    }],
    views :  [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Offers'
    }],
    shares :  [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Offers'
    }],
    
    
}, {
    timestamps: true
})
const UsersMetaData = mongoose.model('usersmetadata', userMetaDataSchema)

module.exports = UsersMetaData