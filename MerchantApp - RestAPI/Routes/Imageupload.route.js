const express = require('express')

const router = express.Router()
const {imageuploadController} = require('../Controllers/Imageupload.Controller')

router.post('/', imageuploadController.uploadImage )
router.post('/storeimages', imageuploadController.saveStoreImage )
router.put('/storeimages/:storeID', imageuploadController.updateStoreImages )
router.get('/storeimages/:storeID', imageuploadController.getStoreImage )
router.post('/banner', imageuploadController.saveBannerImage )
router.get('/banner', imageuploadController.getBannerImage )
router.get('/banner/:bannerID', imageuploadController.getBannerInfo )
router.put('/banner/:bannerID', imageuploadController.updatebannerInfo )
router.get('/bannerByzipcodes', imageuploadController.getBannerImageByZipcodes )
router.delete('/banner', imageuploadController.deleteBannerImage )



module.exports = router
