import HttpStatus from 'http-status-codes'
import { ControllerFunction } from '../types/index.type'
import { CoinsPlan, CoinsPlanDTO } from '../types/coinsPlans.type'
import * as coinsPlanService from '../services/coinsPlan.service'

export const addCoinsPlan: ControllerFunction<CoinsPlanDTO> = async (req, res, next) => {
  try {
    const newCoinsPlan = req.body

    const addedCoinsPlan = await coinsPlanService.addCoinsPlan(newCoinsPlan)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Add coins plan was successful.', addedCoinsPlan })
  } catch (error) {
    next(error)
  }
}

export const removeCoinsPlan: ControllerFunction<{ coinsPlanId: CoinsPlan['_id'] }> = async (req, res, next) => {
  try {
    const { coinsPlanId } = req.body

    const removedCoinsPlan = await coinsPlanService.removeCoinsPlan(coinsPlanId)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Remove coins plan was successful.', removedCoinsPlan })
  } catch (error) {
    next(error)
  }
}
