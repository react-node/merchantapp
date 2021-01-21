const createError = require('http-errors')
const ProfileModel = require('../Models/User.model')


class ProfileContorller {
    async getProfileDetails(req, res, next){
        try {
           
            const profileData = await ProfileModel.findById(req.payload.aud)
            res.send(profileData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
    
    
}

module.exports = {
    "profileController" : new ProfileContorller()
}