import { Router } from 'express'
import { validate } from 'express-validation'
import * as userController from '../controllers/user.controller'
import * as userValidationSchemas from '../validation/user.validationSchema'
import { authMiddleware } from '../middlewares/auth.middleware'

const userRouter: Router = Router()

/* POST routes */
userRouter.post(
  '/addPaymentPlan',
  validate(userValidationSchemas.addPaymentPlanSchema),
  authMiddleware,
  userController.addPaymentPlan
)

/* PUT routes */
userRouter.put(
  '/changePassword',
  validate(userValidationSchemas.changePasswordSchema),
  authMiddleware,
  userController.changePassword
)

/* PATCH routes */
userRouter.patch(
  '/changeBasicInformation',
  validate(userValidationSchemas.changeBasicInformationSchema),
  authMiddleware,
  userController.changeBasicInformation
)

export default userRouter

