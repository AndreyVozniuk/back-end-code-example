import { NextFunction, Request, Response } from 'express'
import * as tokenService from '../services/token.service'
import ApiError from '../customError'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const userData = tokenService.validateToken(accessToken)
    if (!userData) {
      return next(ApiError.UnauthorizedError())
    }

    req.body.user = userData
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}
