const express = require('express')

const router = express.Router()
const StoreController = require('../Controllers/Store.Controller')

router.post('/', StoreController.addStore)
router.get('/', StoreController.getStores)


module.exports = router
