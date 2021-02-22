const express = require('express')

const router = express.Router()
const {SlotBookingController} = require('../Controllers/SlotBooking.Controller')

router.post('/banner', SlotBookingController.saveBookingInfo)
router.post('/offer', SlotBookingController.saveOfferBookingInfo)
router.post('/searchbanneravailability', SlotBookingController.searchBannerSlots)
router.post('/searchofferavailability', SlotBookingController.searchOfferSlots)

module.exports = router