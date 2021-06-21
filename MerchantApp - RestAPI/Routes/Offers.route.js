const express = require('express')

const router = express.Router()
const {offersController} = require('../Controllers/Offers.Controller')

router.post('/', offersController.addOffers )
router.put('/', offersController.updateOffers )
router.put('/:offerID', offersController.updateOffersInfo )
router.put('/updatemetadata/:offerID', offersController.updateOffersMetaData )
router.get('/storesandoffers', offersController.getstoresAndOffers )
router.get('/', offersController.getOffers )
router.get('/getOfferByZipcodes', offersController.getOfferByZipcodes )
router.get('/getAllOffers', offersController.getAllOffers )
router.post('/storesbyoffer', offersController.getstoresbyoffer )
//router.get('/getOffersbyStore/:storeID', offersController.getOffersbyStore )
router.delete('/:offerID', offersController.deleteOffer )
router.get('/:offerID', offersController.getOfferBYID )
//router.put('/:offerID', offersController.updateOfferStatus )


module.exports = router
