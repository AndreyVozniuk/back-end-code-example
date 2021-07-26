import { Router } from 'express'
import { validate } from 'express-validation'
import * as coinsPlanController from '../controllers/coinsPlan.controller'
import * as coinsPlanValidSchemas from '../validation/coinsPlan.validationSchema'
import { authMiddleware } from '../middlewares/auth.middleware'

const coinsPlanRouter: Router = Router()

coinsPlanRouter.post(
  '/addCoinsPlan',
  validate(coinsPlanValidSchemas.addCoinsPlanSchema),
  authMiddleware,
  coinsPlanController.addCoinsPlan
)

coinsPlanRouter.post(
  '/removeCoinsPlan',
  validate(coinsPlanValidSchemas.removeCoinsPlan),
  authMiddleware,
  coinsPlanController.removeCoinsPlan
)

coinsPlanRouter.post(
  '/editCoinsPlan',
  validate(coinsPlanValidSchemas.editCoinsPlan),
  authMiddleware,
  coinsPlanController.editCoinsPlan
)
