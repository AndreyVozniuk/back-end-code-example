import { Types } from 'mongoose'
import { User } from './user.type'

export type Token = {
  _id: Types.ObjectId
  user: User['_id']
  refreshToken: string
  restorePasswordToken: string
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type GoogleDataForTokens = {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}

export type GoogleTokensData = {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  id_token: string
}

export type TokenName  = 'refreshToken' | 'restorePasswordToken'


