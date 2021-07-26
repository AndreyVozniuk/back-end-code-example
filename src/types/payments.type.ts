import { Types } from 'mongoose'
import { User } from './user.type'
import { Subscription } from './subscriptions.type'

export type Payment = {
  _id: Types.ObjectId
  user: User['_id']
  type: string
  price: number
  createdAt: Date
  refundAt?: Date
  paymentId: string
  status: string
  saleProduct?: 'coins' | 'realMoney' | 'upc'
  saleSubscriptionId?: Subscription['_id']
  itemsAmount?: number
}

export type PayPalPaymentResource = {
  billing_agreement_id: string
  amount: {
    total: number
    currency: number
    details: {
      subtotal: number
    }
  }
  payment_mode: string
  update_time: Date
  create_time: Date
  protection_eligibility_type: string
  transaction_fee: {
    currency: string
    value: number
  },
  protection_eligibility: string
  links: {
    method: string
    rel: string
    href: string
  }[],
  id: string,
  state: string,
  invoice_number: string
}

export type addPayPalPaymentBody = {
  id: string
  create_time: Date
  resource: PayPalPaymentResource
}
