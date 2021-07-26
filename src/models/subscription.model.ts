import { Schema, model, Document, Types } from 'mongoose'
import { Subscription } from '../types/subscriptions.type'
import { CollectionNames } from '../enums'

const historyItem = {
  action: { type: String, required: true },
  createdAt: { type: String, required: true },
  paymentId: { type: String, required: false },
  reason: { type: String, required: false }
}

const subscriptionSchema: Schema = new Schema({
  type: { type: String, required: true },
  subscriptionId: { type: String, required: false },
  user: { type: Types.ObjectId, ref: 'user' },
  status: { type: String, required: true },
  createdAt: { type: Date, required: true },
  history: { type: [historyItem], required: false }
})

export default model<Document & Subscription>(CollectionNames.subscription, subscriptionSchema)

