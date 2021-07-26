import { config } from 'dotenv'
import * as subscriptionService from '../services/subscriptions.service'
import PaymentPlanModel from '../models/paymentPlan.model'
import UserModel from '../models/user.model'
import SubscriptionModel from '../models/subscription.model'
import PaymentModel from '../models/payment.model'
import { User } from '../types/user.type'
import { PaymentPlan } from '../types/paymentPlan.type'
import { PayPalPaymentResource } from '../types/payments.type'
import ApiError from '../customError'
import {PaymentStatus, PaymentType, SubscriptionAction, SubscriptionStatus} from '../enums'
import { axiosPayPalCheckoutInstance } from '../axiosInstances'
config()

const API_URL = process.env.API_URL as string

export const getPayPalLinkForPaymentPlan =
  async (paymentPlanId: PaymentPlan['_id'], typeOfPaymentPlan: string, userId: User['_id']): Promise<string | undefined> => {
  const paymentPlan = await PaymentPlanModel.findById(paymentPlanId)
  const user = await UserModel.findById(userId)

  if(!paymentPlan || !user) {
    throw ApiError.BadRequest('Payment plan or user not found.')
  }

  const payPalPlanId = typeOfPaymentPlan === 'month' ? paymentPlan.payPalMonthPlanId : paymentPlan.payPalYearPlanId
  const { links } = await subscriptionService.addPayPalSubscription(payPalPlanId, user.firstName, user.lastName, user.email, user._id)

  return links.find(link => link.rel === 'approve')?.href
}

export const addPayPalPayment = async (id: string, create_time: Date, resource: PayPalPaymentResource): Promise<void> => {
  const subscriberEmail = await subscriptionService.getPayPalSubscriberEmail(resource.billing_agreement_id)

  const subscriber = await UserModel
    .findOne({ email: subscriberEmail })
    .lean()

  const subscription = await SubscriptionModel
    .findOne({ subscriptionId: resource.billing_agreement_id })

  if(!subscriber || !subscription) {
    throw ApiError.BadRequest('User or subscription doesn`t found.')
  }

  subscription.status = SubscriptionStatus.ACTIVE
  subscription.history.push({
    action: SubscriptionAction.PAY_MONEY_FOR_SUBSCRIPTION,
    createdAt: new Date()
  })

  await subscription.save()
  await PaymentModel.create({
    user: subscriber._id,
    type: PaymentType.PAYPAL,
    status: PaymentStatus.SALE,
    price: Number(resource.amount.total),
    createdAt: create_time,
    paymentId: id,
    saleSubscriptionId: subscription._id
  })
}

export const refundPayPalPayment = async (id: string, create_time: Date) => {
  const payment = await PaymentModel.findById(id)

  if(!payment) {
    throw ApiError.BadRequest('Payment doesn`t found.')
  }

  const subscription = await SubscriptionModel.findById(payment.saleSubscriptionId)

  if(!subscription) {
    throw ApiError.BadRequest('Subscription doesn`t found.')
  }

  payment.status = PaymentStatus.REFUND
  payment.refundAt = create_time

  subscription.status = SubscriptionStatus.REFUND
  subscription.history.push({
    action: SubscriptionAction.REFUND_MONEY_FOR_SUBSCRIPTION,
    createdAt: new Date()
  })

  await payment.save()
  await subscription.save()
}

export const getPayPalLinkForPaymentOrder = async (userId: User['_id'], money: number, itemsAmount: number, saleProduct: string) => {
  const paymentOrderInfo = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: money
      }
    }],
    application_context: {
      brand_name: 'Kaldrop dev',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${API_URL}/api/payments/executePayPalPaymentOrder`,
      cancel_url: `https://google.com`
    }
  }

  const { data } = await axiosPayPalCheckoutInstance.post(`/orders`, paymentOrderInfo)

  await PaymentModel.create({
    user: userId,
    type: PaymentType.PAYPAL,
    status: PaymentStatus.PENDING_PAYMENT,
    price: money,
    createdAt: data.create_time || new Date(),
    paymentId: data.id,
    saleProduct,
    itemsAmount
  })

  return data.links.find((link: { rel: string }) => link.rel === 'approve')?.href
}

export const executePayPalPaymentOrder = async (token: string) => {
  const { data } = await axiosPayPalCheckoutInstance.post(`/orders/${token}/capture`, {})

  const payment = await PaymentModel.findOne({ paymentId: data.id })

  if(!payment) {
    throw ApiError.BadRequest('Payment info not found.')
  }

  const userId = payment.user
  const user = await UserModel.findById(userId)

  if(!user) {
    throw ApiError.BadRequest('User not found.')
  }

  if(payment.itemsAmount && payment.saleProduct === 'coins') {
    user.coins = payment.itemsAmount
  }

  if(payment.itemsAmount && payment.saleProduct === 'realMoney') {
    user.realMoney = payment.itemsAmount
  }

  if(payment.itemsAmount && payment.saleProduct === 'upc') {
    user.upc = payment.itemsAmount
  }

  payment.status = PaymentStatus.SALE

  await payment.save()
  await user.save()
}
