import { type NextFunction, type Request, type Response } from 'express'

import { Messages } from './constants'
import logger from './logger'

const { NODE_ENV } = process.env

export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isPublic: boolean = true
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
  }
}

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  logger.error(error.stack || error.message)
  const isHttpError = error instanceof HttpError
  const isErrorPublic = isHttpError ? error.isPublic : false
  const statusCode = isHttpError && error.isPublic ? error.statusCode : 500
  response.status(statusCode).json({
    message:
      NODE_ENV === 'production' && !isErrorPublic
        ? Messages.ERROR_GENERIC
        : error.message
  })
}
