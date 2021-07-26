import { ControllerFunction } from '../types/index.type'
import * as subscriptionsService from '../services/subscriptions.service'

export const cancelPayPalSubscription: ControllerFunction = async (req, res, next) => {
  try {
    const { resource } = req.body

    await subscriptionsService.cancelPayPalSubscription(resource.id, resource.status_change_note)

    console.log('Cancel PayPal subscription was successful', JSON.stringify(req.body, null, 2))
  } catch (error) {
    next(error)
  }
}

export const suspendedPayPalSubscription: ControllerFunction = async (req, res, next) => {
  try {
    const { resource } = req.body

    await subscriptionsService.suspendedPayPalSubscription(resource.id, resource.status_change_note)

    console.log('Suspended PayPal subscription was successful', JSON.stringify(req.body, null, 2))
  } catch (error) {
    next(error)
  }
}

export const activatePayPalSubscription: ControllerFunction = async (req, res, next) => {
  try {
    const { resource } = req.body

    await subscriptionsService.activatePayPalSubscription(resource.id)

    console.log('Activate PayPal subscription was successful', JSON.stringify(req.body, null, 2))
  } catch (error) {
    next(error)
  }
}

export const expirePayPalSubscription: ControllerFunction = async (req, res, next) => {
  try {
    const { resource } = req.body

    await subscriptionsService.expirePayPalSubscription(resource.id)

    console.log('Expire PayPal subscription was successful', JSON.stringify(req.body, null, 2))
  } catch (error) {
    next(error)
  }
}

export const renewedPayPalSubscription: ControllerFunction = async (req, res, next) => {
  try {
    const { resource } = req.body

    await subscriptionsService.renewedPayPalSubscription(resource.id)

    console.log('Renewed PayPal subscription was successful', JSON.stringify(req.body, null, 2))
  } catch (error) {
    next(error)
  }
}
