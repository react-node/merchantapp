const express = require('express')

const router = express.Router()
const StoreController = require('../Controllers/Store.Controller')

router.post('/', StoreController.addStore)
router.put('/', StoreController.updateStore)
router.get('/', StoreController.getStores)
router.delete('/:storeID', StoreController.deleteStore)
router.get('/:storeID', StoreController.getStoreByID)
router.get('/getAllStores', StoreController.getAllStores)


module.exports = router
