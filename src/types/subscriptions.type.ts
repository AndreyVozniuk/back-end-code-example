import { Types } from 'mongoose'
import { User } from './user.type'

export type Subscription = {
  _id: Types.ObjectId
  type: string
  subscriptionId: string
  user: User['_id']
  status: string
  createdAt: Date
  history: {
    action: string
    createdAt: Date
    paymentId?: string
    reason?: string
  }[]
}
