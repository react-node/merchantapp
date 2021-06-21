const express = require('express')

const router = express.Router()
const EndUserController = require('../Controllers/EndUserAuth.Controller')


router.post('/', EndUserController.LoginORSignup)
router.post('/verify', EndUserController.verifyUser)
router.post('/forgotpassword', EndUserController.forgotpassword)
router.post('/updatepassword', EndUserController.updatepassword)

router.post('/refresh-token', EndUserController.refreshToken)

router.delete('/logout', EndUserController.logout)

module.exports = router
