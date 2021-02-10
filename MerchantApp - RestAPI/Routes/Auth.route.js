const express = require('express')

const router = express.Router()
const AuthController = require('../Controllers/Auth.Controller')

router.post('/register', AuthController.register)

router.post('/login', AuthController.login)
router.post('/user/verify', AuthController.verifyUser)
router.post('/user/forgotpassword', AuthController.forgotpassword)
router.post('/user/updatepassword', AuthController.updatepassword)

router.post('/refresh-token', AuthController.refreshToken)

router.delete('/logout', AuthController.logout)

module.exports = router
