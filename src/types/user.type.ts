import { Types } from 'mongoose'

export type User = {
  _id: Types.ObjectId
  firstName: string
  lastName: string
  email: string
  roles: string[]
  isActivated: boolean
  isGoogleAuth: boolean
  isFacebookAuth: boolean
  paymentPlan: Types.ObjectId
  coins: number
  realMoney: number
  upc: number
  password?: string
  avatar?: {
    binary: Buffer
    contentType: string
  }
  avatarUrl?: string
  activationCodeLink?: string
}

export type UserDTO = {
  _id: Types.ObjectId
  email: string
  firstName: string
  lastName: string
  roles: string[]
  isActivated: boolean
  isGoogleAuth: boolean
  isFacebookAuth: boolean
  paymentPlan: Types.ObjectId
  avatarUrl?: string
  avatar?: {
    base64: string
    contentType: string
  }
}

export type TokenUser = {
  _id: Types.ObjectId,
  email: string
}

export type GoogleUser = {
  id: string
  email: string
  verified_email: string
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export type FacebookUser = {
  id: string
  email: string
  first_name: string
  last_name: string
}

