const express = require('express')
const router = express.Router()
const {TestController} = require('../Controllers/Test.Controller')

router.get('/',TestController.testSearch)


module.exports = router
