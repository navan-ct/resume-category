import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import categoryRouter from './category/category-router'
import { ErrorMessages } from './common/utils/constants'
import { errorHandler } from './common/utils/error'
import resumeRouter from './resume/resume-router'

const app = express()
app.use(express.json())
app.use(morgan('tiny'))
app.disable('x-powered-by')
app.use(helmet())
app.use(compression())

app.use('/api/resume', resumeRouter)
app.use('/api/category', categoryRouter)

app.get('/health', (_request, response) => {
  response.sendStatus(200)
})
app.use('*', (_request, response) => {
  response.status(404).json({ message: ErrorMessages.NOT_FOUND })
})
app.use(errorHandler)

export default app
