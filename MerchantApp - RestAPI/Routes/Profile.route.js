const express = require('express')

const router = express.Router()
const {profileController} = require('../Controllers/Profile.Controller')


router.get('/me', profileController.getProfileDetails )
router.put('/me', profileController.updateProfileDetails )
router.get('/dashboard', profileController.dashboard )


module.exports = router
