const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  firstName : Joi.string(),
  lastName :Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  policy:Joi.boolean()
})

module.exports = {
  authSchema,
}
