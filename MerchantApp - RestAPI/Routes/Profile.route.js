const express = require('express')

const router = express.Router()
const {profileController} = require('../Controllers/Profile.Controller')


router.get('/me', profileController.getProfileDetails )
router.get('/me/checkGST/:GSTNumber', profileController.checkGSTNumber )
router.get('/me/validate_identity/:idProofNumber', profileController.verifyIDProof )
//router.get('/me/validate_aadhaar/:aadhaar', profileController.verifyAadhaar )
router.put('/me', profileController.updateProfileDetails )
router.get('/dashboard', profileController.dashboard )


module.exports = router
