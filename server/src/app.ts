import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { Messages } from './utils/constants'
import { HttpError, errorHandler } from './utils/error'

const app = express()
app.use(morgan('tiny'))
app.disable('x-powered-by')
app.use(helmet())
app.use(compression())

app.get('/health', (_request, response) => {
  response.sendStatus(200)
})
app.use('*', () => {
  throw new HttpError(Messages.ERROR_NOT_FOUND, 404)
})
app.use(errorHandler)

export default app
