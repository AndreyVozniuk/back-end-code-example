import { Schema, model, Document, Types } from 'mongoose'
import { Payment } from '../types/payments.type'
import { CollectionNames } from '../enums'

const paymentSchema: Schema = new Schema({
  user: { type: Types.ObjectId, ref: 'user' },
  type: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  refundAt: { type: Date, required: false },
  paymentId: { type: String, required: true },
  saleSubscriptionId: { type: Types.ObjectId, ref: 'subscription', required: false },
  saleProduct: { type: String, required: false },
  itemsAmount: { type: Number, required: false }
})

export default model<Document & Payment>(CollectionNames.payment, paymentSchema)

