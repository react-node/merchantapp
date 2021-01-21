const express = require('express')

const router = express.Router()
const {imageuploadController} = require('../Controllers/Imageupload.Controller')

router.post('/', imageuploadController.uploadImage )


module.exports = router
