import { config } from 'dotenv'
import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import db from 'mongoose'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc'
import authRouter from './routers/auth.router'
import userRouter from './routers/user.router'
import paymentPlanRouter from './routers/paymentPlan.router'
import paymentsRouter from './routers/payments.router'
import subscriptionsRouter from './routers/subscriptions.router'
import { errorMiddleware } from './middlewares/error.middleware'
config()

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.2',
  info: {
    title: 'REST API for Kaldrop.',
    version: '1.0.0',
    description: 'This is the REST API documentation for Kaldrop.'
  },

  host: 'localhost:5000',
  basePath: '/api',
  servers: [
    { url: 'https://localhost:5000/api' }
  ]
}
const swaggerOptions: Options = {
  swaggerDefinition,
  apis: [ `${ __dirname }/docs/**/*.yaml` ]
}
const swaggerSpec = swaggerJSDoc(swaggerOptions)

const app: Application = express()
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/kaldrop'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const PORT = process.env.PORT || 5000

app.use( express.json({ limit: '3mb' }) )
app.use(
  cors({ origin: CLIENT_URL, credentials: true })
)
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/paymentPlan', paymentPlanRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/subscriptions', subscriptionsRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorMiddleware)

db.set('useNewUrlParser', true)
db.set('useFindAndModify', false)
db.set('useCreateIndex', true)
db.set('useUnifiedTopology', true)

const start = async (): Promise<void> => {
  try {
    await db.connect(DB_URI, (err) => {
      if (err) {
        throw new Error(`DB error => ${err.message}`)
      }

      app.listen(PORT, () => console.log(`App has been started on port ${ PORT }`))
    })
  } catch (e) {
    console.log('Error with start server =>', e)
  }
}

start()
