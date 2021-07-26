import { config } from 'dotenv'
import HttpStatus from 'http-status-codes'
import UserModel from '../models/user.model'
import * as authService from '../services/auth.service'
import { ControllerFunction, NotAsyncControllerFunction, RegistrationByEmailBody } from '../types/index.type'
import { TokenUser, User } from '../types/user.type'
import { NameOfTokens } from '../enums'
config()

const CLIENT_URL = process.env.CLIENT_URL as string
const API_URL = process.env.API_URL as string
const REFRESH_TOKEN_COOKIE_AGE = process.env.REFRESH_TOKEN_COOKIE_AGE as string
const ACCESS_TOKEN_COOKIE_AGE = process.env.ACCESS_TOKEN_COOKIE_AGE as string
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string

export const registrationByEmail: ControllerFunction<RegistrationByEmailBody> = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, paymentPlanId } = req.body

    const userData = await authService.registrationByEmail(email, password, firstName, lastName, paymentPlanId)
    res.cookie(NameOfTokens.refreshToken, userData.refreshToken, { maxAge: Number(REFRESH_TOKEN_COOKIE_AGE), httpOnly: true })
    res.cookie(NameOfTokens.accessToken, userData.accessToken, { maxAge: Number(ACCESS_TOKEN_COOKIE_AGE) })

    return res
      .status(HttpStatus.CREATED)
      .json({ user: userData.user, message: 'Registration was successful.' })
  } catch (error) {
    next(error)
  }
}

export const loginByEmail: ControllerFunction<{email:string, password: string}> = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const userData = await authService.loginByEmail(email, password)
    res.cookie(NameOfTokens.refreshToken, userData.refreshToken, { maxAge: Number(REFRESH_TOKEN_COOKIE_AGE), httpOnly: true })
    res.cookie(NameOfTokens.accessToken, userData.accessToken, { maxAge: Number(ACCESS_TOKEN_COOKIE_AGE) })

    return res
      .status(HttpStatus.OK)
      .json({ user: userData.user, message: 'Login was successful.' })
  } catch (error) {
    next(error)
  }
}

export const logout: ControllerFunction<{user: TokenUser}> = async (req, res, next) => {
  try {
    const { user } = req.body

    await authService.logout(user._id)
    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logout was successful.' })
  } catch (error) {
    next(error)
  }
}

export const refreshTokens: ControllerFunction = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies

    const userData = await authService.refreshToken(refreshToken)
    res.cookie(NameOfTokens.refreshToken, userData.refreshToken, { maxAge: Number(REFRESH_TOKEN_COOKIE_AGE), httpOnly: true })
    res.cookie(NameOfTokens.accessToken, userData.accessToken, { maxAge: Number(ACCESS_TOKEN_COOKIE_AGE) })

    return res
      .status(HttpStatus.OK)
      .json({ user: userData.user, message: 'Refresh was successful.' })
  } catch (error) {
    next(error)
  }
}

export const activateAccount: ControllerFunction = async (req, res, next) => {
  try {
    const activationCode: string = req.params.link

    await authService.activateAccount(activationCode)

    return res.redirect(CLIENT_URL)
  } catch (error) {
    next(error)
  }
}

export const getGoogleAuthURL: NotAsyncControllerFunction = (req, res, next) => {
  try {
    const authUrl = authService.getGoogleAuthURL()

    return res
      .status(HttpStatus.OK)
      .json({ authUrl, message: 'Get url for authorization by google was successful.' })
  } catch (error) {
    next(error)
  }
}

export const authByGoogle: ControllerFunction = async (req, res, next) => {
  try {
    const code = req.query.code as string

    const { data: googleTokens } = await authService.getGoogleTokens({
      code,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri: `${API_URL}/api/auth/authByGoogle`,
    })

    const { data: googleUser } = await authService.getGoogleUser(googleTokens)

    const user: User | null = await UserModel.findOne({ email: googleUser.email })

    let userData
    if(user) {
      userData = await authService.loginByGoogleOrFacebook(user)
    } else {
      const registrationData = {
        email: googleUser.email,
        firstName: googleUser.name.split(' ')[0],
        lastName: googleUser.name.split(' ')[1],
        avatarUrl: googleUser.picture,
        isGoogleAuth: true,
        isFacebookAuth: false
      }

      userData = await authService.registrationByGoogleOrFacebook(registrationData)
    }

    res.cookie(NameOfTokens.refreshToken, userData.refreshToken, { maxAge: Number(REFRESH_TOKEN_COOKIE_AGE), httpOnly: true })
    res.cookie(NameOfTokens.accessToken, userData.accessToken, { maxAge: Number(ACCESS_TOKEN_COOKIE_AGE) })

    return res
      .status(HttpStatus.OK)
      .json({ user: userData.user, message: `${user ? 'Login' : 'Registration'} by google was successful.` })
  } catch (error) {
    next(error)
  }
}

export const getFacebookAuthURL: NotAsyncControllerFunction = (req, res, next) => {
  try {
    const authUrl = authService.getFacebookAuthURL()

    return res
      .status(HttpStatus.OK)
      .json({ authUrl, message: 'Get url for authorization by facebook was successful.' })
  } catch (error) {
    next(error)
  }
}

export const authByFacebook: ControllerFunction = async (req, res, next) => {
  try {
    const code = req.query.code as string

    const facebookAccessToken = await authService.getFacebookAccessToken(code)

    const facebookUser = await authService.getFacebookUser(facebookAccessToken)

    const user: User | null = await UserModel.findOne({ email: facebookUser.email })

    let userData
    if(user) {
      userData = await authService.loginByGoogleOrFacebook(user)
    } else {
      const registrationData = {
        email: facebookUser.email,
        firstName: facebookUser.first_name,
        lastName: facebookUser.last_name,
        isGoogleAuth: false,
        isFacebookAuth: true
      }

      userData = await authService.registrationByGoogleOrFacebook(registrationData)
    }

    res.cookie(NameOfTokens.refreshToken, userData.refreshToken, { maxAge: Number(REFRESH_TOKEN_COOKIE_AGE), httpOnly: true })
    res.cookie(NameOfTokens.accessToken, userData.accessToken, { maxAge: Number(ACCESS_TOKEN_COOKIE_AGE) })

    return res
      .status(HttpStatus.OK)
      .json({ user: userData.user, message: `${user ? 'Login' : 'Registration'} by facebook was successful.` })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword: ControllerFunction<{email:string}> = async (req, res, next) => {
  try {
    const { email } = req.body

    await authService.forgotPassword(email)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Link for restore password successfully sent.' })
  } catch (error) {
    next(error)
  }
}

export const restorePassword: ControllerFunction<{restorePasswordToken:string, newPassword: string}> = async (req, res, next) => {
  try {
    const { restorePasswordToken, newPassword } = req.body

    await authService.restorePassword(restorePasswordToken, newPassword)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Restore password was successfully.' })
  } catch (error) {
    next(error)
  }
}
