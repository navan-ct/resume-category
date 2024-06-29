import { type RequestHandler } from 'express'

import { ICategoryParams } from '../routers/category-router'
import * as categoryService from '../services/category-service'

export const addCategory: RequestHandler = async (request, response) => {
  const category = await categoryService.addCategory(request.body.name)
  response.status(201).json({
    data: { category }
  })
}

export const renameCategory: RequestHandler<ICategoryParams> = async (
  request,
  response
) => {
  const category = await categoryService.renameCategory(
    request.params.id,
    request.body.name
  )
  response.status(200).json({
    data: { category }
  })
}

export const removeCategory: RequestHandler<ICategoryParams> = async (
  request,
  response
) => {
  await categoryService.removeCategory(request.params.id)
  response.sendStatus(204)
}
