import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import TokenModel from '../models/token.model'
import { TokenUser, User } from '../types/user.type'
import { Token, TokenName, Tokens } from '../types/token.type'
config()

const SECRET_KEY = process.env.SECRET_KEY as string
const ACCESS_TOKEN_AGE = process.env.ACCESS_TOKEN_AGE as string
const REFRESH_TOKEN_AGE = process.env.REFRESH_TOKEN_AGE as string
const RESTORE_PASSWORD_TOKEN_AGE = process.env.RESTORE_PASSWORD_TOKEN_AGE as string

export const generateAuthTokens = (payload: TokenUser): Tokens => {
  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_AGE })
  const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: REFRESH_TOKEN_AGE })

  return {
    accessToken,
    refreshToken
  }
}

export const generateRestorePasswordToken = (payload: { email: string, userId: User['_id'] }): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: RESTORE_PASSWORD_TOKEN_AGE })
}

export const saveToken = async (userId: User['_id'], tokenName: TokenName, tokenValue: string): Promise<void | Token> => {
  const tokenData = await TokenModel.findOne({ user: userId })

  if (tokenData) {
    tokenData[tokenName] = tokenValue
    tokenData.save()
    return
  }

  return await TokenModel.create({ user: userId, [tokenName]: tokenValue })
}

export const removeToken = async (userId: User['_id'], tokenName: TokenName): Promise<void> => {
  await TokenModel.updateOne(
    { user: userId },
    { $unset: { [tokenName]: '' } }
  )
}

export const findToken = async (tokenName: TokenName, tokenValue: string): Promise<Token | null> => {
  return TokenModel.findOne({ [tokenName]: tokenValue })
}

export const validateToken = (token: string): JwtPayload & Partial<User> | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload & Partial<User>
  } catch (error) {
    return null
  }
}

