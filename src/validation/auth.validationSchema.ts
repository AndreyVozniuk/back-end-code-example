import { Joi } from 'express-validation'
import * as validSchemas from './index.validationSchema'

export const registrationByEmailSchema = {
  body: Joi.object({
    email: validSchemas.emailValidationSchema,
    password: validSchemas.passwordValidationSchema,
    firstName: validSchemas.stringMinTwoSymbolSchema,
    lastName: validSchemas.stringMinTwoSymbolSchema,
    paymentPlanId: validSchemas.mongoIdSchema
  })
}

export const loginByEmailSchema = {
  body: Joi.object({
    email: validSchemas.emailValidationSchema,
    password: validSchemas.passwordValidationSchema
  })
}

export const forgotPasswordSchema = {
  body: Joi.object({
    email: validSchemas.emailValidationSchema
  })
}

export const restorePasswordSchema = {
  body: Joi.object({
    restorePasswordToken: validSchemas.jwtTokenValidationSchema,
    newPassword: validSchemas.passwordValidationSchema
  })
}
