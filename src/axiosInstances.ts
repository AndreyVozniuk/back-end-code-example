import { config } from 'dotenv'
import axios from 'axios'
config()

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string
const PAYPAL_SECRET = process.env.PAYPAL_SECRET as string
const PAYPAL_BILLING_API = process.env.PAYPAL_BILLING_API as string
const PAYPAL_CHECKOUT_API = process.env.PAYPAL_CHECKOUT_API as string

export const axiosPayPalBillingInstance = axios.create({
  baseURL: PAYPAL_BILLING_API,
  headers: {
    'Content-Type': 'application/json'
  },
  auth: {
    username: PAYPAL_CLIENT_ID,
    password: PAYPAL_SECRET
  }
})

export const axiosPayPalCheckoutInstance = axios.create({
  baseURL: PAYPAL_CHECKOUT_API,
  headers: {
    'Content-Type': 'application/json'
  },
  auth: {
    username: PAYPAL_CLIENT_ID,
    password: PAYPAL_SECRET
  }
})
