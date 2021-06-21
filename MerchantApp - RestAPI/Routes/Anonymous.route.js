const express = require('express')

const router = express.Router()
const UtilsController = require('../Controllers/Utils.Controller')
const {SlotBookingController} = require('../Controllers/SlotBooking.Controller')
const {offersController} = require('../Controllers/Offers.Controller')
const {ProductController} = require('../Controllers/ProductSearch.Controller')
const StoreController = require('../Controllers/Store.Controller')

router.get('/storetype', UtilsController.getStoreTypes)
router.get('/cityAndZipcodes', UtilsController.getCityZipcodes)
router.get('/getBanners', SlotBookingController.getBanners)
router.get('/getOffers', SlotBookingController.getOffers)
router.get('/getNearByOffers', offersController.getstoresAndOffers)
router.get('/searchStore/:searchString', StoreController.getStoreDetails)
router.get('/getSearchStores', offersController.getStoresBySearch)
router.get('/searchMalls/:searchString', StoreController.searchMalls)
router.get('/searchAllStorers', offersController.getstoresAndOffersBySearch)
router.get('/searchAllStorers', offersController.getstoresAndOffersBySearch)
router.get('/searchCategory/:searchString', ProductController.searchProduct)


module.exports = router
