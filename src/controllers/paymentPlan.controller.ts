import HttpStatus from 'http-status-codes'
import * as planService from '../services/paymentPlan.service'
import { ControllerFunction } from '../types/index.type'
import { PaymentPlan, PaymentPlanDTO } from '../types/paymentPlan.type'

export const addPaymentPlan: ControllerFunction<PaymentPlanDTO> = async (req, res, next) => {
  try {
    const newPaymentPlan = req.body

    const addedPaymentPlan = await planService.addPaymentPlan(newPaymentPlan)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Add plan was successful.', addedPaymentPlan })
  } catch (error) {
    next(error)
  }
}

export const removePaymentPlan:
  ControllerFunction<{paymentPlanId: PaymentPlan['_id'], paymentPlanPayPalMonthId: string, paymentPlanPayPalYearId: string}> = async (req, res, next) => {
  try {
    const { paymentPlanId, paymentPlanPayPalMonthId, paymentPlanPayPalYearId } = req.body

    const removedPaymentPlan = await planService.removePaymentPlanById(paymentPlanId, paymentPlanPayPalMonthId, paymentPlanPayPalYearId)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Remove plan was successful.', removedPaymentPlan })
  } catch (error) {
    next(error)
  }
}

export const editPaymentPlan: ControllerFunction<{id: PaymentPlan['_id'], fieldsForUpdate: Partial<PaymentPlanDTO>}> = async (req, res, next) => {
  try {
    const { id, fieldsForUpdate } = req.body

    const updatedPaymentPlan = await planService.editPaymentPlanById(id, fieldsForUpdate)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Edit plan was successful.', updatedPaymentPlan })
  } catch (error) {
    next(error)
  }
}
