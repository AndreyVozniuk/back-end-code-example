import { Schema, model, Document } from 'mongoose'
import { Role } from '../types/role.type'
import { CollectionNames } from '../enums'

const roleSchema: Schema = new Schema({
  value: { type: String, unique: true, required: true, default: 'USER' }
})

export default model<Document & Role>(CollectionNames.role, roleSchema)

