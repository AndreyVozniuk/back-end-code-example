import { Joi } from 'express-validation'
import * as validSchemas from './index.validationSchema'

export const getPayPalLinkForPaymentPlanSchema = {
  body: Joi.object({
    paymentPlanId: validSchemas.mongoIdSchema,
    typeOfPaymentPlan: Joi.string().valid('month', 'year').required(),
    userId: validSchemas.mongoIdSchema
  })
}

export const getPayPalLinkForPaymentOrderSchema = {
  body: Joi.object({
    userId: validSchemas.mongoIdSchema,
    money: validSchemas.numberGreaterZeroSchema,
    itemsAmount: validSchemas.numberGreaterZeroSchema,
    saleProduct: Joi.string().valid('coins', 'upc', 'realMoney').required()
  })
}
