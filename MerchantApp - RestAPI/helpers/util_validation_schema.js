const Joi = require('@hapi/joi')

const StoreTypeValidation = Joi.object({
  type : Joi.string(),
  categories : Joi.array()
 
})
const SlotBookingValidation = Joi.object({
  
  ownerID : Joi.string(),

  selectStores : Joi.array().items(Joi.object({
    zipcode: Joi.number().required().messages({"any.required": "zipcode is missing "}),
    selectedDates : Joi.array().required().messages({"any.required": "Selected dates are required"}),
    id : Joi.string()
  }).required().messages({"any.required": "Missing selected stores and dates"})),
  bannerDetails : Joi.object({
    imagePath : Joi.string().required().messages({"any.required": "Missing image path"}),
    id : Joi.string()
  }),
  transactionID : Joi.string().required().messages({"any.required": "Missing transaction id "}),
  totalPaid : Joi.number().required().messages({"any.required": "Missing total amount "})
}).unknown(true)

const OfferSlotBookingValidation = Joi.object({
  
  ownerID : Joi.string(),

  selectStores : Joi.array().items(Joi.object({
    zipcode: Joi.number().required().messages({"any.required": "zipcode is missing "}),
    selectedDates : Joi.array().required().messages({"any.required": "Selected dates are required"}),
    id : Joi.string()
  }).required().messages({"any.required": "Missing selected stores and dates"})),
  bannerDetails : Joi.object({
    name : Joi.string().required().messages({"any.required": "Missing image path"}),
    id : Joi.string()
  }),
  transactionID : Joi.string().required().messages({"any.required": "Missing transaction id "}),
  totalPaid : Joi.number().required().messages({"any.required": "Missing total amount "})
}).unknown(true)

module.exports = {
    StoreTypeValidation,
    SlotBookingValidation,
    OfferSlotBookingValidation
}
