import { Joi } from 'express-validation'
import * as validSchemas from './index.validationSchema'

export const changePasswordSchema = {
  body: Joi.object({
    newPassword: validSchemas.passwordValidationSchema,
    oldPassword: validSchemas.passwordValidationSchema,
  })
}

export const changeBasicInformationSchema = {
  body: Joi.object({
    firstName: validSchemas.stringMinTwoSymbolSchema,
    lastName: validSchemas.stringMinTwoSymbolSchema,
    email: validSchemas.emailValidationSchema,
    avatar: validSchemas.optionalImageValidationSchema
  })
}

export const addPaymentPlanSchema = {
  body: Joi.object({
    paymentPlanId: validSchemas.mongoIdSchema
  })
}
