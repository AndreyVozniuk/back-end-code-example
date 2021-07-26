import { Router } from 'express'
import { validate } from 'express-validation'
import * as paymentsController from '../controllers/payments.controller'
import * as paymentsValidSchemas from '../validation/payments.validationSchema'
import { authMiddleware } from '../middlewares/auth.middleware'

const paymentsRouter: Router = Router()

/* POST routes */
paymentsRouter.post(
  '/addPayPalPayment',
  paymentsController.addPayPalPayment
)

paymentsRouter.post(
  '/refundPayPalPayment',
  paymentsController.refundPayPalPayment
)

paymentsRouter.post(
  '/getPayPalLinkForPaymentPlan',
  validate(paymentsValidSchemas.getPayPalLinkForPaymentPlanSchema),
  // authMiddleware,
  paymentsController.getPayPalLinkForPaymentPlan
)

paymentsRouter.post(
  '/getPayPalLinkForPaymentOrder',
  validate(paymentsValidSchemas.getPayPalLinkForPaymentOrderSchema),
  // authMiddleware,
  paymentsController.getPayPalLinkForPaymentOrder
)

/* GET routes */
paymentsRouter.get(
  '/executePayPalPaymentOrder',
  // authMiddleware,
  paymentsController.executePayPalPaymentOrder
)

export default paymentsRouter
