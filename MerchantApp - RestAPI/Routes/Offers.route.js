const express = require('express')

const router = express.Router()
const {offersController} = require('../Controllers/Offers.Controller')

router.post('/', offersController.addOffers )
router.put('/', offersController.updateOffers )
router.get('/storesandoffers', offersController.getstoresAndOffers )
router.get('/', offersController.getOffers )
router.post('/storesbyoffer', offersController.getstoresbyoffer )
//router.get('/getOffersbyStore/:storeID', offersController.getOffersbyStore )
router.delete('/:offerID', offersController.deleteOffer )
//router.put('/:offerID', offersController.updateOfferStatus )


module.exports = router
