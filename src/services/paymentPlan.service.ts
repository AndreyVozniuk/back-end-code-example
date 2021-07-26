import { config } from 'dotenv'
import { clone } from 'ramda'
import PaymentPlanModel from '../models/paymentPlan.model'
import { BillingCycles, BillingCyclesItem, PaymentPlan, PaymentPlanDTO, PayPalPlanResponse } from '../types/paymentPlan.type'
import { getPaymentPlanDTO } from '../dtos/paymentPlan.dto'
import { convertFromBase64ToBinary, convertTrialPeriodDurationToPayPalFormat } from '../helpers'
import { axiosPayPalBillingInstance } from '../axiosInstances'
import ApiError from '../customError'
config()

const PAYPAL_PRODUCT_ID = process.env.PAYPAL_PRODUCT_ID as string

export const addPaymentPlan = async (newPaymentPlan: PaymentPlanDTO): Promise<PaymentPlanDTO> => {
  const { monthPlan, yearPlan } = await addPayPalPaymentPlan(newPaymentPlan)

  const payPalFields = {
    payPalMonthPlanId: monthPlan.id,
    payPalYearPlanId: yearPlan.id,
    payPalProductId: monthPlan.product_id || yearPlan.product_id
  }

  let image = undefined
  if(newPaymentPlan.image) {
    image = convertFromBase64ToBinary(newPaymentPlan.image.base64, newPaymentPlan.image.contentType)
  }

  const addedPaymentPlan = await PaymentPlanModel.create({
    ...newPaymentPlan,
    ...payPalFields,
    image
  })

  return getPaymentPlanDTO(addedPaymentPlan)
}

export const removePaymentPlanById = async (id: PaymentPlan['_id'], payPalMonthId: string, PayPalYearId: string): Promise<PaymentPlanDTO> => {
  const removedPaymentPlan = await PaymentPlanModel
    .findByIdAndRemove(id)
    .lean()

  if(!removedPaymentPlan) {
    throw ApiError.BadRequest('Payment plan not found.')
  }

  await deactivatePayPalPaymentPlan(payPalMonthId, PayPalYearId)

  return getPaymentPlanDTO(removedPaymentPlan)
}

export const editPaymentPlanById = async (id: PaymentPlan['_id'], fieldsForUpdate: Partial<PaymentPlanDTO>): Promise<PaymentPlanDTO> => {
  let image = undefined
  if(fieldsForUpdate.image) {
    image = convertFromBase64ToBinary(fieldsForUpdate.image.base64, fieldsForUpdate.image.contentType)
  }

  const updatedPaymentPlan = await PaymentPlanModel
    .findByIdAndUpdate(id, { ...fieldsForUpdate as PaymentPlan, image }, { new: true })
    .lean()

  if(!updatedPaymentPlan) {
    throw ApiError.BadRequest('Payment plan not found.')
  }

  if(fieldsForUpdate.price || fieldsForUpdate.planName || fieldsForUpdate.trialPeriod) {
    const { monthPlan, yearPlan } = await addPayPalPaymentPlan(updatedPaymentPlan)

    const updatedPaymentPlanPayPal = await PaymentPlanModel
      .findByIdAndUpdate(id, {
          payPalMonthPlanId: monthPlan.id,
          payPalYearPlanId: yearPlan.id,
          payPalProductId: monthPlan.product_id || yearPlan.product_id
        },
        { new: true }
      )
      .lean()

    if(!updatedPaymentPlanPayPal) {
      throw ApiError.BadRequest('Payment plan not found.')
    }

    return getPaymentPlanDTO(updatedPaymentPlanPayPal)
  }

  return getPaymentPlanDTO(updatedPaymentPlan)
}

const addPayPalPaymentPlan =
  async (paymentPlanInfo: PaymentPlanDTO | PaymentPlan): Promise<{ monthPlan: PayPalPlanResponse, yearPlan: PayPalPlanResponse }> => {
  const billing_cycles: BillingCycles = []

  if(paymentPlanInfo.trialPeriod) {
    const { interval_unit, total_cycles } = convertTrialPeriodDurationToPayPalFormat(paymentPlanInfo.trialPeriod.duration)

    const billingCyclesTrial: BillingCyclesItem = {
      frequency: {
        interval_unit,
        interval_count: 1
      },
      tenure_type: 'TRIAL',
      sequence: 1,
      total_cycles
    }

    if(paymentPlanInfo.trialPeriod.price > 0) {
      billingCyclesTrial.pricing_scheme = {
        fixed_price: {
          value: paymentPlanInfo.trialPeriod.price,
          currency_code: 'USD'
        }
      }
    }

    billing_cycles.push(billingCyclesTrial)
  }

  billing_cycles.push({
    frequency: {
      interval_unit: 'MONTH',
      interval_count: 1
    },
    tenure_type: 'REGULAR',
    sequence: paymentPlanInfo.trialPeriod ? 2 : 1,
    total_cycles: 0, // infinite
    pricing_scheme: {
      fixed_price: {
        value: paymentPlanInfo.price.monthly,
        currency_code: 'USD'
      }
    }
  })

  const payPalMonthPlan = {
    product_id: PAYPAL_PRODUCT_ID,
    name: paymentPlanInfo.planName,
    description: 'No description yet.',
    status: 'ACTIVE',
    billing_cycles,
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: {
        value: paymentPlanInfo.price.monthly,
        currency_code: 'USD'
      },
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3
    },
    taxes: {
      percentage: 0,
      inclusive: false
    }
  }

  const payPalYearPlan = clone(payPalMonthPlan)
  payPalYearPlan.payment_preferences.setup_fee.value = paymentPlanInfo.price.annual
  payPalYearPlan.billing_cycles.map(plan => {
    if(plan.tenure_type === 'REGULAR') {
      plan.frequency.interval_unit = 'YEAR'
      if(plan.pricing_scheme) {
        plan.pricing_scheme.fixed_price.value = paymentPlanInfo.price.annual
      }
    }

    return plan
  })

  const { data: monthPlan } = await axiosPayPalBillingInstance.post('/plans', payPalMonthPlan)
  const { data: yearPlan } =  await axiosPayPalBillingInstance.post('/plans', payPalYearPlan)

  return { monthPlan, yearPlan }
}

const deactivatePayPalPaymentPlan = async (monthPlanId: string, yearPlanId: string): Promise<void> => {
  await axiosPayPalBillingInstance.post(`/plans/${monthPlanId}/deactivate`)
  await axiosPayPalBillingInstance.post(`/plans/${yearPlanId}/deactivate`)
}
