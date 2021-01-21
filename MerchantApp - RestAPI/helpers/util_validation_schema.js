const Joi = require('@hapi/joi')

const StoreTypeValidation = Joi.object({
  type : Joi.string(),
  categories : Joi.array()
 
})

module.exports = {
    StoreTypeValidation
}
