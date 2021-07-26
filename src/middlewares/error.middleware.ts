import { NextFunction, Request, Response } from 'express'
import  { ValidationError } from 'express-validation'
import HttpStatus from 'http-status-codes'
import ApiError from '../customError'

export const errorMiddleware = (err: ApiError | ValidationError | Error, req: Request, res: Response, next: NextFunction): Response => {
  console.log('Error =>', err)

  if(err instanceof ValidationError) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Validation error.', validationDetails: err.details })
  }

  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message || 'Unhandled error.' })
  }

  return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: 'Unhandled error.' })
}
