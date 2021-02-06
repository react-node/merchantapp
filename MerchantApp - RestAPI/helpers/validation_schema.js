const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  firstName : Joi.string(),
  lastName :Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  policy:Joi.boolean()
})

const StoreValidation = Joi.object({
  name : Joi.string(),
  address :Joi.string(),
  isActive : Joi.boolean(),
  owner : Joi.string(),
  zipcode : Joi.number(),
  storeType : Joi.array().items(Joi.object({
    type: Joi.string(),
    categories : Joi.array().required().messages({"any.required": "please add categories "})
  }).required().messages({"any.required": "please add store type"})),
  location : Joi.object({
    type : Joi.string(),
    coordinates : Joi.array().required().messages({"any.required": "coordinates are required"})
  })
}).unknown(true)

const OffersModelValidation = Joi.array().items(Joi.object({
  offerName : Joi.string(),
  fromDate :Joi.date(),
  isActive : Joi.boolean(),
  storeID : Joi.array(),
  expireDate : Joi.date(),
  discountType : Joi.string(),
  discount : Joi.number(),
  
 
}).unknown(true))

module.exports = {
  authSchema,
  StoreValidation,
  OffersModelValidation
}
