import { Schema, model, Document } from 'mongoose'
import { PaymentPlan } from '../types/paymentPlan.type'
import { CollectionNames } from '../enums'

const ImageSchema = {
  binary: Buffer,
  contentType: String
}

const FeaturesSchema = {
  name: { type: String, require: true },
  hint: { type: String, require: false }
}

const TrialPeriodSchema = {
  price: { type: Number, require: true },
  duration: {
    type: { ['day' || 'month' || 'year']: String },
    require: true
  }
}

const PriceSchema = {
  monthly: { type: Number, require: true },
  annual: { type: Number, require: true },
  compare: { type: Number, require: false }
}

const DiscountBadgeSchema = {
  type: { type: String, require: true },
  amountOfDiscount: { type: Number, require: true },
  description: { type: String, require: true },
  badgeDesign: { type: String, require: true }
}

const paymentPlanSchema: Schema = new Schema({
  payPalMonthPlanId: { type: String, unique: true, required: true },
  payPalYearPlanId: { type: String, unique: true, required: true },
  payPalProductId: { type: String, required: true },
  planName: { type: String, unique: true, required: true },
  buttonName: { type: String, required: true },
  price: { type: PriceSchema, required: true },
  amountOfMonitoredProducts: { type: Number, required: true },
  platform: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  isUnlimitedListings: { type: Boolean, required: true },
  discountBadge: { type: DiscountBadgeSchema, required: false },
  trialPeriod: { type: TrialPeriodSchema, required: false },
  features: { type: [FeaturesSchema], required: false, default: undefined },
  image: { type: ImageSchema, required: false }
})

export default model<Document & PaymentPlan>(CollectionNames.paymentPlan, paymentPlanSchema)

