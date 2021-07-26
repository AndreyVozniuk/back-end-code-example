import bcrypt from 'bcrypt'
import UserModel from '../models/user.model'
import PaymentPlanModel from '../models/paymentPlan.model'
import { getUserDTO } from '../dtos/user.dto'
import { User, UserDTO } from '../types/user.type'
import { UserBasicInfoForUpdate } from '../types/index.type'
import { PaymentPlan } from '../types/paymentPlan.type'
import ApiError from '../customError'

export const changePassword = async (newPassword: string, oldPassword: string, userId: User['_id']): Promise<void> => {
  const user = await UserModel.findById(userId)

  if (!user || !user.password || user.isGoogleAuth || user.isFacebookAuth) {
    throw ApiError.BadRequest('User not found or auth by other services.')
  }

  const isPasswordsEquals = await bcrypt.compare(oldPassword, user.password)

  if (!isPasswordsEquals) {
    throw ApiError.BadRequest('Incorrect password.')
  }

  const newHashPassword = await bcrypt.hash(newPassword, 3)

  user.password = newHashPassword
  await user.save()
}

export const changeBasicInformation = async (dataForChange: UserBasicInfoForUpdate, userId: User['_id']): Promise<UserDTO> => {
  const user = await UserModel.findById(userId)

  if(!user) {
    throw ApiError.BadRequest('User not found.')
  }

  if(user.firstName !== dataForChange.firstName) {
    user.firstName = dataForChange.firstName
  }

  if(user.lastName !== dataForChange.lastName) {
    user.lastName = dataForChange.lastName
  }

  if(user.email !== dataForChange.email) {
    user.email = dataForChange.email
  }

  const base64 = dataForChange.avatar.split(',')[1]
  const contentType = dataForChange.avatar.split(':')[1].split(';')[0]

  const binary = Buffer.alloc(base64.length, base64, 'base64')

  if(!user.avatar || binary.compare(user.avatar.binary) !== 0){
    user.avatar = { binary, contentType }
  }

  const updatedUser = await user.save()

  return getUserDTO(updatedUser)
}

export const addPaymentPlan = async (paymentPlanId: PaymentPlan['_id'], userId: User['_id']): Promise<UserDTO> => {
  const user = await UserModel.findById(userId)

  if(!user || user.paymentPlan) {
    throw ApiError.BadRequest('User doesn`t exist or already has payment plan.')
  }

  const paymentPlan = await PaymentPlanModel
    .findById(paymentPlanId)
    .lean()

  if(!paymentPlan) {
    throw ApiError.BadRequest('Payment plan not found.')
  }

  user.paymentPlan = paymentPlan._id
  const userWithPaymentPlan = await user.save()

  return getUserDTO(userWithPaymentPlan)
}
