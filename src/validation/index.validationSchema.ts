import { Joi } from 'express-validation'

export const stringMinTwoSymbolSchema = Joi.string().trim().min(2).required()
export const numberGreaterZeroSchema = Joi.number().greater(0).required()
export const booleanSchema = Joi.boolean().required()
export const dateISOSchema = Joi.date().iso().required()
export const mongoIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
export const passwordValidationSchema = Joi.string().trim().min(4).max(32).required()
export const emailValidationSchema = Joi.string().email().required()
export const jwtTokenValidationSchema = Joi.string().token().required()

export const optionalStringMinTwoSymbolSchema = Joi.string().trim().min(2).optional()
export const optionalNumberGreaterZeroSchema = Joi.number().greater(0).optional()
export const optionalImageValidationSchema = Joi.object({
  base64: Joi.string().base64().required(),
  contentType: stringMinTwoSymbolSchema
}).optional()
