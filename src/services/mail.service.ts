import { config } from 'dotenv'
import nodemailer, { Transporter } from 'nodemailer'
config()

const smtpUser = process.env.SMTP_USER as string
const smtpPass = process.env.SMTP_PASSWORD as string
const smtpHost = process.env.SMTP_HOST as string

const transportOptions = {
  host: smtpHost,
  port: 587,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
}

const transporter: Transporter = nodemailer.createTransport(transportOptions)

export const sendActivationMail = async (to: string, link: string): Promise<void> => {
  await transporter.sendMail({
    from: smtpUser,
    to,
    subject: 'Kaldrop activation account',
    text: '',
    html: `
      <div>
          <h1>Go to link for activation account.</h1>
          <a href="${link}">${link}</a>
      </div>
    `
  })
}

export const sendForgotPasswordMail = async (to: string, link:string): Promise<void> => {
  await transporter.sendMail({
    from: smtpUser,
    to,
    subject: 'Restore password in Kaldrop system.',
    text: '',
    html: `
      <div>
          <h1>Go to link for restore password.</h1>
          <a href="${link}">${link}</a>
      </div>
    `
  })
}
