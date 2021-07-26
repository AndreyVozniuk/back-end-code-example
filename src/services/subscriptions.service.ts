import SubscriptionModel from '../models/subscription.model'
import { PayPalSubscriptionResponse } from '../types/index.type'
import { axiosPayPalBillingInstance } from '../axiosInstances'
import { User } from '../types/user.type'
import { PaymentType, SubscriptionAction, SubscriptionStatus } from '../enums'
import ApiError from '../customError'

export const addPayPalSubscription =
  async (planId: string, firstName: string, lastName: string, email: string, userId: User['_id']): Promise<PayPalSubscriptionResponse> => {
    const subscriptionInfo = {
      plan_id: planId,
      start_time: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString(),
      subscriber: {
        name: {
          given_name: firstName,
          surname: lastName
        },
        email_address: email
      },
      application_context: {
        brand_name: 'Kaldrop-dev',
        locale: 'en-US',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        },
        return_url: 'https://www.youtube.com/',
        cancel_url: 'https://github.com/'
      }
    }

    const { data } = await axiosPayPalBillingInstance.post('/subscriptions', subscriptionInfo)
    await SubscriptionModel.create({
      type: PaymentType.PAYPAL,
      subscriptionId: data.id,
      user: userId,
      status: SubscriptionStatus.PAYMENT_PENDING,
      createdAt: data.create_time,
      history: []
    })

    return data
  }

export const getPayPalSubscriberEmail = async (subscriptionId: string): Promise<string> => {
  const { data } = await axiosPayPalBillingInstance.get(`/subscriptions/${subscriptionId}`)

  return data.subscriber.email_address
}

export const cancelPayPalSubscription = async (subscriptionId: string, reason?: string): Promise<void> => {
  const subscription = await SubscriptionModel.findOne({ subscriptionId })

  if(!subscription) {
    throw ApiError.BadRequest('Subscription doesn`t exist.')
  }

  subscription.status = SubscriptionStatus.CANCELLED
  subscription.history.push({
    action: SubscriptionAction.CANCELLED_SUBSCRIPTION,
    createdAt: new Date(),
    reason
  })

  await subscription.save()
}

export const suspendedPayPalSubscription = async (subscriptionId: string, reason?: string): Promise<void> => {
  const subscription = await SubscriptionModel.findOne({ subscriptionId })

  if(!subscription) {
    throw ApiError.BadRequest('Subscription doesn`t exist.')
  }

  subscription.status = SubscriptionStatus.SUSPENDED
  subscription.history.push({
    action: SubscriptionAction.SUSPENDED_SUBSCRIPTION,
    createdAt: new Date(),
    reason
  })

  await subscription.save()
}

export const activatePayPalSubscription = async (subscriptionId: string): Promise<void> => {
  const subscription = await SubscriptionModel.findOne({ subscriptionId })

  if(!subscription) {
    throw ApiError.BadRequest('Subscription doesn`t exist.')
  }

  subscription.status = SubscriptionStatus.ACTIVE
  subscription.history.push({
    action: SubscriptionAction.ACTIVATE_OR_REACTIVATE_SUBSCRIPTION,
    createdAt: new Date()
  })

  await subscription.save()
}

export const expirePayPalSubscription = async (subscriptionId: string): Promise<void> => {
  const subscription = await SubscriptionModel.findOne({ subscriptionId })

  if(!subscription) {
    throw ApiError.BadRequest('Subscription doesn`t exist.')
  }

  subscription.status = SubscriptionStatus.EXPIRED
  subscription.history.push({
    action: SubscriptionAction.EXPIRED_SUBSCRIPTION,
    createdAt: new Date()
  })

  await subscription.save()
}

export const renewedPayPalSubscription = async (subscriptionId: string): Promise<void> => {
  const subscription = await SubscriptionModel.findOne({ subscriptionId })

  if(!subscription) {
    throw ApiError.BadRequest('Subscription doesn`t exist.')
  }

  subscription.status = SubscriptionStatus.ACTIVE
  subscription.history.push({
    action: SubscriptionAction.RENEWED_SUBSCRIPTION,
    createdAt: new Date()
  })

  await subscription.save()
}
