import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()
app.use(morgan('tiny'))
app.disable('x-powered-by')
app.use(helmet())
app.use(compression())

app.get('/health', (_request, response) => {
  response.sendStatus(200)
})

export default app
