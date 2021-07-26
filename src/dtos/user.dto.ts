import { User, UserDTO } from '../types/user.type'
import { convertFromBinaryToBase64 } from '../helpers'

export const getUserDTO = (user: User): UserDTO => {
  let convertedAvatar = undefined

  if(user.avatar) {
    convertedAvatar = convertFromBinaryToBase64(user.avatar.binary, user.avatar.contentType)
  }

  return {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    avatar: convertedAvatar,
    avatarUrl: user.avatarUrl,
    paymentPlan: user.paymentPlan,
    isActivated: user.isActivated,
    isGoogleAuth: user.isGoogleAuth,
    isFacebookAuth: user.isFacebookAuth
  }
}
