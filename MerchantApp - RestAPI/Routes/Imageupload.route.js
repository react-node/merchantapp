const express = require('express')

const router = express.Router()
const {imageuploadController} = require('../Controllers/Imageupload.Controller')

router.post('/', imageuploadController.uploadImage )
router.post('/storeimages', imageuploadController.saveStoreImage )
router.get('/storeimages/:storeID', imageuploadController.getStoreImage )



module.exports = router
