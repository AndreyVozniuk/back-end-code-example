import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import querystring from 'querystring'
import UserModel from '../models/user.model'
import RoleModel from '../models/role.model'
import * as tokenService from '../services/token.service'
import * as mailService from '../services/mail.service'
import { getUserDTO } from '../dtos/user.dto'
import { FacebookUser, GoogleUser, User } from '../types/user.type'
import { GoogleDataForTokens, GoogleTokensData } from '../types/token.type'
import { AuthResponse, DataForRegistrationByGoogleOrFacebook } from '../types/index.type'
import { Role } from '../types/role.type'
import { ListOfRoles, NameOfTokens } from '../enums'
import ApiError from '../customError'
config()

const API_URL = process.env.API_URL as string
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID as string
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET as string
const CLIENT_URL = process.env.CLIENT_URL as string

export const registrationByEmail =
  async (email: string, password: string, firstName: string, lastName: string, paymentPlanId: string): Promise<AuthResponse> => {
  const candidate: User | null = await UserModel.findOne({ email })

  if (candidate) {
    throw ApiError.BadRequest('User already exist.')
  }

  const hashPassword = await bcrypt.hash(password, 3)
  const activationCodeLink = uuidv4()

  const userRole: Role | null = await RoleModel.findOne({ value: ListOfRoles.USER })

  if(!userRole) {
    throw ApiError.BadRequest('Unexpected role.')
  }

  const user: User = await UserModel.create({
    email,
    password: hashPassword,
    firstName,
    lastName,
    activationCodeLink,
    paymentPlan: paymentPlanId,
    roles: [userRole._id],
    isActivated: false,
    isGoogleAuth: false,
    isFacebookAuth: false
  })
  await mailService.sendActivationMail(email, `${API_URL}/api/auth/activateAccount/${activationCodeLink}`)

  const userDTO = getUserDTO(user)
  const tokens = tokenService.generateAuthTokens({ _id: user._id, email: user.email })

  await tokenService.saveToken(user._id, NameOfTokens.refreshToken, tokens.refreshToken)

  return { ...tokens, user: userDTO }
}

export const loginByEmail = async (email: string, password: string): Promise<AuthResponse> => {
  const user: User | null = await UserModel.findOne({ email })

  if (!user || !user.password) {
    throw ApiError.BadRequest('User not found or incorrect password.')
  }

  const isPasswordsEquals = await bcrypt.compare(password, user.password)

  if (!isPasswordsEquals) {
    throw ApiError.BadRequest('Incorrect password or email.')
  }

  const userDTO = getUserDTO(user)
  const tokens = tokenService.generateAuthTokens({ _id: user._id, email: user.email })

  await tokenService.saveToken(user._id, NameOfTokens.refreshToken, tokens.refreshToken)

  return { ...tokens, user: userDTO }
}

export const logout = async (userId: User['_id']): Promise<void> => {
  await tokenService.removeToken(userId, NameOfTokens.refreshToken)
}

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  if(!refreshToken) {
    throw ApiError.UnauthorizedError()
  }

  const userData = tokenService.validateToken(refreshToken)
  const foundToken = await tokenService.findToken(NameOfTokens.refreshToken, refreshToken)

  if(!userData || !foundToken) {
    throw ApiError.UnauthorizedError()
  }

  const user = await UserModel.findById(userData._id)

  if(!user) {
    throw ApiError.BadRequest('User not found.')
  }

  const userDTO = getUserDTO(user)
  const tokens = tokenService.generateAuthTokens({ _id: user._id, email: user.email })

  await tokenService.saveToken(user._id, NameOfTokens.refreshToken, tokens.refreshToken)

  return { ...tokens, user: userDTO }
}

export const activateAccount = async (activationCodeLink: string): Promise<void> => {
  const user = await UserModel.findOne({ activationCodeLink })

  if (!user) {
    throw ApiError.BadRequest('User not found.')
  }

  user.isActivated = true
  await user.save()
}

export const getGoogleAuthURL = (): string => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  const options = {
    redirect_uri: `${API_URL}/api/auth/authByGoogle`,
    client_id: GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  }

  return `${rootUrl}?${querystring.stringify(options)}`
}

export const getGoogleTokens = async (dataForTokens: GoogleDataForTokens): Promise<AxiosResponse<GoogleTokensData>> => {
  try {
    const url = 'https://oauth2.googleapis.com/token'
    const { code, clientId, clientSecret, redirectUri } = dataForTokens

    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }

    return await axios.post(
      url,
      querystring.stringify(values),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
  } catch (e) {
    throw ApiError.BadRequest('Cannot get google tokens.')
  }
}

export const getGoogleUser = async (tokensData: GoogleTokensData): Promise<AxiosResponse<GoogleUser>> => {
  try {
    return await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokensData.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokensData.id_token}`,
        },
      },
    )
  } catch (e) {
    throw ApiError.BadRequest('Cannot get user by google data.')
  }
}

export const registrationByGoogleOrFacebook = async (registrationData: DataForRegistrationByGoogleOrFacebook): Promise<AuthResponse> => {
  const userRole: Role | null = await RoleModel.findOne({ value: ListOfRoles.USER })

  if(!userRole) {
    throw ApiError.BadRequest('Unexpected role.')
  }

  const { email, firstName, lastName, isGoogleAuth, isFacebookAuth, avatarUrl } = registrationData

  const user: User = await UserModel.create({
    email,
    firstName,
    lastName,
    roles: [userRole.value],
    avatarUrl,
    isActivated: true,
    isGoogleAuth,
    isFacebookAuth
  })

  const userDTO = getUserDTO(user)
  const tokens = tokenService.generateAuthTokens({ _id: user._id, email: user.email })

  await tokenService.saveToken(user._id, NameOfTokens.refreshToken, tokens.refreshToken)

  return { ...tokens, user: userDTO }
}

export const loginByGoogleOrFacebook = async (user: User): Promise<AuthResponse> => {
  const userDTO = getUserDTO(user)
  const tokens = tokenService.generateAuthTokens({ _id: user._id, email: user.email })

  await tokenService.saveToken(user._id, NameOfTokens.refreshToken, tokens.refreshToken)

  return { ...tokens, user: userDTO }
}

export const getFacebookAuthURL = (): string => {
  const rootUrl = 'https://www.facebook.com/v4.0/dialog/oauth'

  const options = {
    client_id: FACEBOOK_APP_ID,
    redirect_uri: `${API_URL}/api/auth/authByFacebook`,
    scope: 'email',
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup'
  }

  return `${rootUrl}?${querystring.stringify(options)}/`
}

export const getFacebookAccessToken = async (code: string): Promise<string> => {
  try {
    const { data } = await axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        redirect_uri: `${API_URL}/api/auth/authByFacebook`,
        code
      }
    })

    return data.access_token
  } catch (e) {
    throw ApiError.BadRequest('Cannot get facebook access token.')
  }
}

export const getFacebookUser = async (accessToken: string): Promise<FacebookUser> => {
  try {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: accessToken,
      },
    })

    return data
  } catch (e) {
    throw ApiError.BadRequest('Cannot get facebook user.')
  }
}

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await UserModel.findOne({ email })

  if (!user) {
    throw ApiError.BadRequest('User not found.')
  }

  if(user.isGoogleAuth || user.isFacebookAuth) {
    throw ApiError.BadRequest('You cannot restore password because you auth using Google or Facebook. Try use Google or Facebook auth.')
  }

  const restorePasswordToken = tokenService.generateRestorePasswordToken({ email, userId: user._id })
  await tokenService.saveToken(user._id, NameOfTokens.restorePasswordToken, restorePasswordToken)

  const restorePasswordLink = `${CLIENT_URL}/restorePassword/${restorePasswordToken}`
  await mailService.sendForgotPasswordMail(email, restorePasswordLink)
}

export const restorePassword = async (restorePasswordToken: string, newPassword: string): Promise<void> => {
  const userData = tokenService.validateToken(restorePasswordToken)

  if(!userData) {
    throw ApiError.BadRequest('Restore password token is invalid 1.')
  }

  const user = await UserModel.findById(userData.userId)
  const foundToken = await tokenService.findToken(NameOfTokens.restorePasswordToken, restorePasswordToken)

  if(!user || !foundToken) {
    throw ApiError.BadRequest('Restore password token is invalid 2.')
  }

  const hashPassword = await bcrypt.hash(newPassword, 3)

  user.password = hashPassword

  await tokenService.removeToken(userData.userId, NameOfTokens.restorePasswordToken)
  await user.save()
}

