import HttpStatus from 'http-status-codes'
import * as paymentService from '../services/payments.service'
import { ControllerFunction } from '../types/index.type'
import { User } from '../types/user.type'
import { PaymentPlan } from '../types/paymentPlan.type'
import { addPayPalPaymentBody } from '../types/payments.type'

export const addPayPalPayment: ControllerFunction<addPayPalPaymentBody> = async (req, res, next) => {
  try {
    const { id, create_time, resource } = req.body

    await paymentService.addPayPalPayment(id, create_time, resource)

    console.log('Add PayPal payment was successful', JSON.stringify(req.body, null, 2))
  } catch (error) {
    next(error)
  }
}

export const getPayPalLinkForPaymentPlan:
  ControllerFunction<{paymentPlanId: PaymentPlan['_id'], typeOfPaymentPlan: string, userId: User['_id']}> = async (req, res, next) => {
  try {
    const { paymentPlanId, typeOfPaymentPlan, userId } = req.body

    const paymentLink = await paymentService.getPayPalLinkForPaymentPlan(paymentPlanId, typeOfPaymentPlan, userId)

    return res
      .status(HttpStatus.OK)
      .json({ paymentLink, message: 'Get payPal payment link was successful.' })
  } catch (error) {
    next(error)
  }
}

export const getPayPalLinkForPaymentOrder:
  ControllerFunction<{userId: User['_id'], money: number, itemsAmount: number, saleProduct: string}> = async (req, res, next) => {
  try {
    const { userId, money, itemsAmount, saleProduct } = req.body

    const paymentLink = await paymentService.getPayPalLinkForPaymentOrder(userId, money, itemsAmount, saleProduct)

    return res
      .status(HttpStatus.OK)
      .json({ paymentLink, message: 'Get payPal payment link was successful.' })
  } catch (error) {
    next(error)
  }
}

export const refundPayPalPayment: ControllerFunction<{id: string, create_time: Date}> = async (req, res, next) => {
  try {
    const { id, create_time } = req.body

    await paymentService.refundPayPalPayment(id, create_time)

    console.log('Refund PayPal payment was successful', JSON.stringify(req.body, null, 2))
  } catch (error) {
    next(error)
  }
}

export const executePayPalPaymentOrder: ControllerFunction = async (req, res, next) => {
  try {
    const token = req.query.token as string

    await paymentService.executePayPalPaymentOrder(token)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Execute payPal payment order was successful.' })
  } catch (error) {
    next(error)
  }
}

