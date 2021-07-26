import HttpStatus from 'http-status-codes'
import * as userService from '../services/user.service'
import { ControllerFunction } from '../types/index.type'
import { TokenUser } from '../types/user.type'
import { PaymentPlan } from '../types/paymentPlan.type'

export const changePassword: ControllerFunction<{newPassword:string, oldPassword: string, user: TokenUser}> = async (req, res, next) => {
  try {
    const { user, newPassword, oldPassword } = req.body

    await userService.changePassword(newPassword, oldPassword, user._id)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Change password was successful.' })
  } catch (error) {
    next(error)
  }
}

export const changeBasicInformation:
  ControllerFunction<{firstName:string, lastName: string, email: string, avatar: string, user: TokenUser}> = async (req, res, next) => {
  try {
    const { firstName, lastName, email, avatar, user } = req.body

    const updatedUser = await userService.changeBasicInformation({ firstName, lastName, email, avatar }, user._id)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Change basic information was successful.', updatedUser })
  } catch (error) {
    next(error)
  }
}

export const addPaymentPlan: ControllerFunction<{paymentPlanId: PaymentPlan['_id'], user: TokenUser}> = async (req, res, next) => {
  try {
    const { paymentPlanId, user } = req.body

    const userWithPaymentPlan = await userService.addPaymentPlan(paymentPlanId, user._id)

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Add payment was successful.', userWithPaymentPlan })
  } catch (error) {
    next(error)
  }
}
