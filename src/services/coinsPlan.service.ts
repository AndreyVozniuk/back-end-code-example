import CoinsPlanModel from '../models/coinsPlan.model'
import { CoinsPlan, CoinsPlanDTO } from '../types/coinsPlans.type'
import { convertFromBase64ToBinary } from '../helpers'

export const addCoinsPlan = async (newCoinsPlan: CoinsPlanDTO) => {
  let image = undefined
  if(newCoinsPlan.image) {
    image = convertFromBase64ToBinary(newCoinsPlan.image.base64, newCoinsPlan.image.contentType)
  }

  const addedCoinsPLan = await CoinsPlanModel.create({
    ...newCoinsPlan,
    image
  })

  return addedCoinsPLan
}

export const removeCoinsPlan = async (coinsPlanId:  CoinsPlan['_id']) => {
  const removedCoinsPLan = await CoinsPlanModel
    .findByIdAndRemove(coinsPlanId)
    .lean()

  return removedCoinsPLan
}


