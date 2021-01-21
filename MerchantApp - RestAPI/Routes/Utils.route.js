const express = require('express')

const router = express.Router()
const StoreTypeController = require('../Controllers/Utils.Controller')

router.post('/storetype', StoreTypeController.addStoreType)
router.get('/storetype', StoreTypeController.getStoreTypes)
router.put('/storetype/:storeID', StoreTypeController.updateStoreCategories)
router.delete('/storetype/:storeID', StoreTypeController.deleteStoreCategories)

module.exports = router
