import { Types } from 'mongoose'

export type CoinsPlan = {
  _id: Types.ObjectId
  isActive: boolean
  amountOfCoins: number
  buttonName: string
  pricePerCoin: number
  image?: {
    binary: Buffer
    contentType: string
  }
  discountBadge?: {
    description: string
    badgeDesign: string
  }
}

export type CoinsPlanDTO = Omit<CoinsPlan, 'image'> & { image?: { base64: string, contentType: string } }

