import { NextFunction, Request, Response } from 'express'
import { Tokens } from './token.type'
import { UserDTO } from './user.type'

export type AuthResponse = Tokens & { user: UserDTO }
export type DataForRegistrationByGoogleOrFacebook = {
  email: string
  firstName: string
  lastName: string
  isGoogleAuth: boolean
  isFacebookAuth: boolean
  avatarUrl?: string
}
export type UserBasicInfoForUpdate = {
  firstName:string
  lastName: string
  email: string
  avatar: string
}
export type RegistrationByEmailBody = {
  email:string
  password: string
  firstName: string
  lastName: string
  paymentPlanId: string
}
export type PayPalSubscriptionResponse = {
  id: string
  plan_id: string
  start_time: Date
  subscriber: {
    name: {
      given_name: string,
      surname: string
    },
    email_address: string
  },
  create_time: Date,
  links: {
    href: string,
    rel: string,
    method: string
  }[]
  status: string,
  status_update_time: Date
}

export type RoleMiddlewareReturnType = (req: Request, res: Response, next: NextFunction) => void
export type ControllerFunction<ReqBody = any> = (req: Request<any, any, ReqBody>, res: Response, next: NextFunction) => Promise<Response | void>
export type NotAsyncControllerFunction<ReqBody = any> = (req: Request<any, any, ReqBody>, res: Response, next: NextFunction) => Response | void
