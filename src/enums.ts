export enum CollectionNames {
  paymentPlan = 'paymentPlan',
  coinsPlan = 'coinsPlan',
  role = 'role',
  token = 'token',
  user = 'user',
  subscription = 'subscription',
  payment = 'payment'
}

export enum ListOfRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MARKETER = 'MARKETER',
  WORKER = 'WORKER'
}

export enum NameOfTokens {
  refreshToken = 'refreshToken',
  restorePasswordToken = 'restorePasswordToken',
  accessToken = 'accessToken'
}

export enum SubscriptionStatus {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  ACTIVE = 'ACTIVE',
  REFUND = 'REFUND',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED'
}

export enum SubscriptionAction {
  PAY_MONEY_FOR_SUBSCRIPTION = 'PAY_MONEY_FOR_SUBSCRIPTION',
  REFUND_MONEY_FOR_SUBSCRIPTION = 'REFUND_MONEY_FOR_SUBSCRIPTION',
  CANCELLED_SUBSCRIPTION = 'CANCELLED_SUBSCRIPTION',
  SUSPENDED_SUBSCRIPTION = 'SUSPENDED_SUBSCRIPTION',
  ACTIVATE_OR_REACTIVATE_SUBSCRIPTION = 'ACTIVATE_OR_REACTIVATE_SUBSCRIPTION',
  EXPIRED_SUBSCRIPTION = 'EXPIRED_SUBSCRIPTION',
  RENEWED_SUBSCRIPTION = 'RENEWED_SUBSCRIPTION',
}

export enum PaymentStatus {
  SALE = 'SALE',
  REFUND = 'REFUND',
  PENDING_PAYMENT = 'PENDING_PAYMENT'
}

export enum PaymentType {
  PAYPAL = 'PAYPAL'
}
