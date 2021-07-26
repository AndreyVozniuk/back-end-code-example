import { NextFunction, Request, Response } from 'express'
import * as tokenService from '../services/token.service'
import ApiError from '../customError'
import { RoleMiddlewareReturnType } from '../types/index.type'

export const roleMiddleware = (listOfRoles: string[]): RoleMiddlewareReturnType => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      next()
    }

    // @ts-ignore
    const accessToken: string = req.headers.authorization.split(' ')[1]
    const userData = tokenService.validateToken(accessToken)

    const hasAccess = Boolean(
      // @ts-ignore
      userData.roles.some(role => listOfRoles.includes(role))
    )

    if(!hasAccess) {
      next(ApiError.noAccessError())
    }

    next()
  }
}
