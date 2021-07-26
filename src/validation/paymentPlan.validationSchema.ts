import { Joi } from 'express-validation'
import * as validSchemas from './index.validationSchema'

export const addPaymentPlanSchema = {
  body: Joi.object({
    planName: validSchemas.stringMinTwoSymbolSchema,
    buttonName: validSchemas.stringMinTwoSymbolSchema,
    price: Joi.object({
      monthly: validSchemas.numberGreaterZeroSchema,
      annual: validSchemas.numberGreaterZeroSchema,
      compare: validSchemas.optionalNumberGreaterZeroSchema,
    }).required(),
    amountOfMonitoredProducts: validSchemas.numberGreaterZeroSchema,
    platform: Joi.string().valid('ebay', 'shopify', 'facebook').required(),
    isActive: validSchemas.booleanSchema,
    isUnlimitedListings: validSchemas.booleanSchema,
    discountBadge: Joi.object({
      type: Joi.string().valid('percentages', 'dollars').required(),
      amountOfDiscount: validSchemas.numberGreaterZeroSchema,
      description: validSchemas.stringMinTwoSymbolSchema,
      badgeDesign: validSchemas.stringMinTwoSymbolSchema,
    }).optional(),
    trialPeriod: Joi.object({
      price: validSchemas.numberGreaterZeroSchema,
      duration: Joi.object({
        year: validSchemas.optionalNumberGreaterZeroSchema,
        day: validSchemas.optionalNumberGreaterZeroSchema,
        month: validSchemas.optionalNumberGreaterZeroSchema,
      }).required()
    }).optional(),
    features: Joi.array().items(Joi.object({
      name: validSchemas.stringMinTwoSymbolSchema,
      hint: validSchemas.optionalStringMinTwoSymbolSchema
    })).optional(),
    image: validSchemas.optionalImageValidationSchema
  })
}

export const removePaymentPlanSchema = {
  body: Joi.object({
    paymentPlanId: validSchemas.mongoIdSchema,
    paymentPlanPayPalMonthId: validSchemas.stringMinTwoSymbolSchema,
    paymentPlanPayPalYearId: validSchemas.stringMinTwoSymbolSchema
  })
}

export const editPaymentPlanSchema = {
  body: Joi.object({
    id: validSchemas.mongoIdSchema,
    fieldsForUpdate: Joi.object({
      planName: validSchemas.optionalStringMinTwoSymbolSchema,
      buttonName: validSchemas.optionalStringMinTwoSymbolSchema,
      price: Joi.object({
        monthly: validSchemas.numberGreaterZeroSchema,
        annual: validSchemas.numberGreaterZeroSchema,
        compare: validSchemas.optionalStringMinTwoSymbolSchema,
      }).optional(),
      amountOfMonitoredProducts: validSchemas.numberGreaterZeroSchema,
      platform: Joi.string().valid('ebay', 'shopify', 'facebook').optional(),
      isActive: validSchemas.booleanSchema,
      isUnlimitedListings: validSchemas.booleanSchema,
      discountBadge: Joi.object({
        type: Joi.string().valid('percentages', 'dollars').required(),
        amountOfDiscount: validSchemas.numberGreaterZeroSchema,
        description: validSchemas.stringMinTwoSymbolSchema,
        badgeDesign: validSchemas.stringMinTwoSymbolSchema,
      }).optional(),
      trialPeriod: Joi.object({
        price: validSchemas.numberGreaterZeroSchema,
        duration: Joi.object({
          year: validSchemas.optionalNumberGreaterZeroSchema,
          day: validSchemas.optionalNumberGreaterZeroSchema,
          month: validSchemas.optionalNumberGreaterZeroSchema,
        }).required()
      }).optional(),
      features: Joi.array().items(Joi.object({
        name: validSchemas.stringMinTwoSymbolSchema,
        hint: validSchemas.optionalStringMinTwoSymbolSchema
      })).optional(),
      image: validSchemas.optionalImageValidationSchema
    }).required()
  })
}
