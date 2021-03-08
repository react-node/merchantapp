
const express = require('express')
const {PaymentController} = require('../Controllers/Payment.Controller')
const { verifyAccessToken } = require('../helpers/jwt_helper')

const router = express.Router()

router.post("/",verifyAccessToken,PaymentController.checksumValidate)
router.post("/callback/:type",PaymentController.paymentCallback)
router.get("/orderDetails/:type/:orderID",verifyAccessToken,PaymentController.getOrderDetails)


module.exports = router