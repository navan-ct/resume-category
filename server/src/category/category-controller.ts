import { type RequestHandler } from 'express'

import * as categoryService from './category-service'

export const addCategory: RequestHandler = async (request, response, next) => {
  try {
    const category = await categoryService.addCategory(request.body.name)
    response.status(201).json({ category })
  } catch (error) {
    next(error)
  }
}

export const renameCategory: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const category = await categoryService.renameCategory(
      request.params['id']!,
      request.body.name
    )
    response.status(200).json({ category })
  } catch (error) {
    next(error)
  }
}

export const removeCategory: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    await categoryService.removeCategory(request.params['id']!)
    response.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
