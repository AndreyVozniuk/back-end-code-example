import { Types } from 'mongoose'

export type PaymentPlan = {
  _id: Types.ObjectId
  payPalMonthPlanId: string,
  payPalYearPlanId: string,
  payPalProductId: string,
  planName: string
  buttonName: string
  price: {
    monthly: number
    annual: number
    compare?: number
  }
  amountOfMonitoredProducts: number
  platform: 'ebay' | 'shopify' | 'facebook'
  isActive: boolean
  isUnlimitedListings: boolean
  discountBadge?: {
    type: 'percentages' | 'dollars'
    amountOfDiscount: number
    description: string
    badgeDesign: string
  }
  trialPeriod?: {
    price: number,
    duration: { day: number } | { month: number } | { year: number }
  }
  features?: {
    name: string
    hint?: string
  }[]
  image?: {
    binary: Buffer
    contentType: string
  }
}

export type PaymentPlanDTO = Omit<PaymentPlan, 'image'> & { image?: { base64: string, contentType: string } }

export type BillingCyclesItem = {
  pricing_scheme?: {
    fixed_price: {
      value: number,
      currency_code: string
    }
  },
  frequency: {
    interval_unit: string,
    interval_count: number
  },
  tenure_type: string,
  sequence: number,
  total_cycles: number
}

export type BillingCycles = BillingCyclesItem[]

export type PayPalPlanResponse = {
  id: string
  product_id: string
  name: string
  status: string
  description: string
  usage_type: string
  created_time: Date
  links: string[]
}
