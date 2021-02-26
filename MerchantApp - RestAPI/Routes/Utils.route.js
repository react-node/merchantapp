const express = require('express')

const router = express.Router()
const UtilsController = require('../Controllers/Utils.Controller')

router.post('/storetype', UtilsController.addStoreType)
router.post('/malls', UtilsController.addMalls)
router.get('/malls/:zipcode', UtilsController.getMalls)
router.get('/storetype', UtilsController.getStoreTypes)
router.get('/price/:type', UtilsController.getprice)
router.put('/storetype/:storeID', UtilsController.updateStoreCategories)
router.delete('/storetype/:storeID', UtilsController.deleteStoreCategories)

module.exports = router
