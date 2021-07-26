import { Schema, model, Types, Document } from 'mongoose'
import { User } from '../types/user.type'
import { CollectionNames } from '../enums'

const AvatarSchema = {
  binary: Buffer,
  contentType: String
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  activationCodeLink: { type: String, required: false },
  roles: [{ type: Types.ObjectId, ref: CollectionNames.role, required: true }],
  coins: { type: Number, required: true, default: 0 },
  realMoney: { type: Number, required: true, default: 0 },
  upc: { type: Number, required: true, default: 0 },
  avatar: { type: AvatarSchema, required: false },
  avatarUrl: { type: String, required: false },
  paymentPlan: { type: Types.ObjectId, ref: CollectionNames.paymentPlan, required: true },
  isActivated: { type: Boolean, required: false },
  isGoogleAuth: { type: Boolean, required: true },
  isFacebookAuth: { type: Boolean, required: true }
})

export default model<Document & User>(CollectionNames.user, userSchema)
