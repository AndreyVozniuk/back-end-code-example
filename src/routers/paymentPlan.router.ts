import { Router } from 'express'
import { validate } from 'express-validation'
import * as planController from '../controllers/paymentPlan.controller'
import * as paymentPlanValidSchemas from '../validation/paymentPlan.validationSchema'
import { authMiddleware } from '../middlewares/auth.middleware'

const paymentPlanRouter: Router = Router()

/* POST routes */
paymentPlanRouter.post(
  '/addPaymentPlan',
  validate(paymentPlanValidSchemas.addPaymentPlanSchema),
  authMiddleware,
  planController.addPaymentPlan
)

/* DELETE routes */
paymentPlanRouter.delete(
  '/removePaymentPlan',
  validate(paymentPlanValidSchemas.removePaymentPlanSchema),
  authMiddleware,
  planController.removePaymentPlan
)

/* PATCH routes */
paymentPlanRouter.patch(
  '/editPaymentPlan',
  validate(paymentPlanValidSchemas.editPaymentPlanSchema),
  authMiddleware,
  planController.editPaymentPlan
)

export default paymentPlanRouter
