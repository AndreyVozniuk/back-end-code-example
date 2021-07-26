import { CoinsPlan, CoinsPlanDTO } from '../types/coinsPlans.type'
import { convertFromBinaryToBase64 } from '../helpers'

export const getCoinsPlanDTO = (coinsPlan: CoinsPlan): CoinsPlanDTO => {
  let convertedImage = undefined

  if(coinsPlan.image) {
    convertedImage = convertFromBinaryToBase64(coinsPlan.image.binary, coinsPlan.image.contentType)
  }

  return {
    _id: coinsPlan._id,
    isActive: coinsPlan.isActive,
    amountOfCoins: coinsPlan.amountOfCoins,
    buttonName: coinsPlan.buttonName,
    pricePerCoin: coinsPlan.pricePerCoin,
    discountBadge: coinsPlan.discountBadge,
    image: convertedImage
  }
}
