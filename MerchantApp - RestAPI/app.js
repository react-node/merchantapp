const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const multer = require('multer')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
require('./helpers/init_redis')
var cors = require('cors')
const AuthRoute = require('./Routes/Auth.route')
const StoreRoute = require('./Routes/Store.route')
const UtilsRoute = require('./Routes/Utils.route')
const OffersRoute = require('./Routes/Offers.route')
const ImageuploadRoute = require('./Routes/Imageupload.route')
const ProfileRoute = require('./Routes/Profile.route')

const app = express()
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(multerMid.single('file'))

app.get('/', verifyAccessToken, async (req, res, next) => {
  console.log(req.body)
  res.send('Hello from express.')
})

app.use('/auth', AuthRoute)
app.use('/rest/v1/store', verifyAccessToken, StoreRoute)
app.use('/rest/v1/utils', verifyAccessToken, UtilsRoute)
app.use('/rest/v1/offers', verifyAccessToken, OffersRoute)
app.use('/rest/v1/imageupload', verifyAccessToken, ImageuploadRoute)
app.use('/rest/v1/profile', verifyAccessToken, ProfileRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV
console.log(NODE_ENV)
 
app.listen(PORT, () => {
  console.log(`Server running at \\${PORT}\\`)
})
