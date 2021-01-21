const express = require('express')

const router = express.Router()
const {offersController} = require('../Controllers/Offers.Controller')

router.post('/', offersController.addOffers )
router.get('/', offersController.getstoresAndOffers )


module.exports = router
