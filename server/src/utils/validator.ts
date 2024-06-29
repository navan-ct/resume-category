import { type RequestHandler } from 'express'
import { type Schema } from 'joi'

export const validateBody: <Params>(schema: Schema) => RequestHandler<Params> =
  (schema) => (request, response, next) => {
    const result = schema.validate(request.body)
    if (result.error) {
      response.status(400).json({ message: result.error.message })
    } else next()
  }
