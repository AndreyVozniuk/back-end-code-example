import { Joi } from 'express-validation'
import * as validSchemas from './index.validationSchema'

export const addCoinsPlanSchema = {
  body: Joi.object({
    isActive: validSchemas.booleanSchema,
    amountOfCoins: validSchemas.numberGreaterZeroSchema,
    buttonName: validSchemas.stringMinTwoSymbolSchema,
    pricePerCoin: validSchemas.numberGreaterZeroSchema,
    amountOfMonitoredProducts: validSchemas.numberGreaterZeroSchema,
    discountBadge: Joi.object({
      description: validSchemas.stringMinTwoSymbolSchema,
      badgeDesign: validSchemas.stringMinTwoSymbolSchema,
    }).optional(),
    image: validSchemas.optionalImageValidationSchema
  })
}

export const removeCoinsPlan = {
  body: Joi.object({
    coinsPlanId: validSchemas.mongoIdSchema
  })
}

export const editCoinsPlan = {
  body: Joi.object({

  })
}
