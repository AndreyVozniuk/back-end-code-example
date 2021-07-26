import { Router } from 'express'
import { validate } from 'express-validation'
import * as authController from '../controllers/auth.controller'
import * as authValidSchemas from '../validation/auth.validationSchema'
import { authMiddleware } from '../middlewares/auth.middleware'

const authRouter: Router = Router()

/* POST routes */
authRouter.post(
  '/registrationByEmail',
  validate(authValidSchemas.registrationByEmailSchema),
  authController.registrationByEmail
)
authRouter.post(
  '/loginByEmail',
  validate(authValidSchemas.loginByEmailSchema),
  authController.loginByEmail
)
authRouter.post(
  '/forgotPassword',
  validate(authValidSchemas.forgotPasswordSchema),
  authController.forgotPassword
)
authRouter.post(
  '/restorePassword',
  validate(authValidSchemas.restorePasswordSchema),
  authController.restorePassword
)

/* GET routes */
authRouter.get('/activateAccount/:link', authController.activateAccount)
authRouter.get('/refreshTokens', authController.refreshTokens)
authRouter.get('/getGoogleAuthLink', authController.getGoogleAuthURL)
authRouter.get('/getFacebookAuthLink', authController.getFacebookAuthURL)
authRouter.get('/authByGoogle', authController.authByGoogle)
authRouter.get('/authByFacebook', authController.authByFacebook)

/* DELETE routes */
authRouter.delete('/logout', authMiddleware, authController.logout)

export default authRouter
