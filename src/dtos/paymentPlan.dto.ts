import { PaymentPlan, PaymentPlanDTO } from '../types/paymentPlan.type'
import { convertFromBinaryToBase64 } from '../helpers'

export const getPaymentPlanDTO = (paymentPlan: PaymentPlan): PaymentPlanDTO => {
  let convertedImage = undefined

  if(paymentPlan.image) {
    convertedImage = convertFromBinaryToBase64(paymentPlan.image.binary, paymentPlan.image.contentType)
  }

  return {
    _id: paymentPlan._id,
    payPalMonthPlanId: paymentPlan.payPalMonthPlanId,
    payPalYearPlanId: paymentPlan.payPalYearPlanId,
    payPalProductId: paymentPlan.payPalProductId,
    planName: paymentPlan.planName,
    buttonName: paymentPlan.buttonName,
    price: paymentPlan.price,
    amountOfMonitoredProducts: paymentPlan.amountOfMonitoredProducts,
    platform: paymentPlan.platform,
    isActive: paymentPlan.isActive,
    isUnlimitedListings: paymentPlan.isUnlimitedListings,
    discountBadge: paymentPlan.discountBadge,
    trialPeriod: paymentPlan.trialPeriod,
    features: paymentPlan.features,
    image: convertedImage
  }
}
