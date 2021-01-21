const express = require('express')

const router = express.Router()
const {profileController} = require('../Controllers/Profile.Controller')


router.get('/me', profileController.getProfileDetails )


module.exports = router
