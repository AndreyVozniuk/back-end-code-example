import { Schema, model, Types, Document } from 'mongoose'
import { Token } from '../types/token.type'
import { CollectionNames } from '../enums'

const tokenSchema: Schema = new Schema({
  user: { type: Types.ObjectId, ref: 'user' },
  refreshToken: { type: String },
  restorePasswordToken: { type: String }
})

export default model<Document & Token>(CollectionNames.token, tokenSchema)
