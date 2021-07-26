import HttpStatus from 'http-status-codes'

export default class ApiError extends Error {
  status

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }

  static UnauthorizedError(): ApiError {
    return new ApiError(HttpStatus.UNAUTHORIZED, 'User not authorized.')
  }

  static noAccessError(): ApiError {
    return new ApiError(HttpStatus.FORBIDDEN, 'User doesn`t have access to this route.')
  }

  static BadRequest(message: string): ApiError {
    return new ApiError(HttpStatus.BAD_REQUEST, message)
  }
}
