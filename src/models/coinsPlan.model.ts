import { Schema, model, Document } from 'mongoose'
import { CoinsPlan } from '../types/coinsPlans.type'
import { CollectionNames } from '../enums'

const DiscountBadgeSchema = {
  description: { type: String, require: true },
  badgeDesign: { type: String, require: true }
}

const ImageSchema = {
  binary: Buffer,
  contentType: String
}

const coinsPlanSchema: Schema = new Schema({
  isActive: { type: Boolean, required: true },
  amountOfCoins: { type: Boolean, required: true },
  buttonName: { type: Boolean, required: true },
  pricePerCoin: { type: Boolean, required: true },
  image: { type: ImageSchema, required: false },
  discountBadge: { type: DiscountBadgeSchema, required: false }
})

export default model<Document & CoinsPlan>(CollectionNames.coinsPlan, coinsPlanSchema)
