import { type Server } from 'http'
import mongoose from 'mongoose'

import app from './app'
import { ErrorMessages, InfoMessages } from './utils/constants'
import logger from './utils/logger'

const { SERVER_PORT, DATABASE_URI } = process.env

const shutDownGracefully = (server: Server) => () => {
  server.close(async () => {
    logger.info(InfoMessages.SERVER_STOPPED)
    await mongoose.connection.close()
  })
}

const main = async () => {
  if (!SERVER_PORT || !DATABASE_URI) {
    logger.error(ErrorMessages.ENVIRONMENT_VARIABLE)
    process.exit(1)
  }

  mongoose.connection.on('connected', () => {
    logger.info(InfoMessages.DATABASE_CONNECTED)
  })
  mongoose.connection.on('error', (error) => {
    logger.error(error.stack || error.message)
  })
  mongoose.connection.on('disconnected', () => {
    logger.info(InfoMessages.DATABASE_DISCONNECTED)
    mongoose.connection.removeAllListeners()
  })
  try {
    await mongoose.connect(DATABASE_URI)
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.stack || error.message)
    }
    process.exit(1)
  }

  const server = app.listen(SERVER_PORT, () => {
    logger.info(InfoMessages.SERVER_STARTED)
  })

  process.on('SIGINT', shutDownGracefully(server))
  process.on('SIGTERM', shutDownGracefully(server))
}

main()
