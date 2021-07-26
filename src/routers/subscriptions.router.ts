import { Router } from 'express'
import * as subscriptionsController from '../controllers/subscriptions.controller'

const subscriptionsRouter: Router = Router()

/* POST routes */
subscriptionsRouter.post(
  '/cancelPayPalSubscription',
  subscriptionsController.cancelPayPalSubscription
)

subscriptionsRouter.post(
  '/suspendedPayPalSubscription',
  subscriptionsController.suspendedPayPalSubscription
)

subscriptionsRouter.post(
  '/activatePayPalSubscription',
  subscriptionsController.activatePayPalSubscription
)

subscriptionsRouter.post(
  '/expirePayPalSubscription',
  subscriptionsController.expirePayPalSubscription
)

subscriptionsRouter.post(
  '/renewedPayPalSubscription',
  subscriptionsController.renewedPayPalSubscription
)

export default subscriptionsRouter
