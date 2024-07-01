import { type RequestHandler } from 'express'

import * as categoryService from '../services/category-service'

export const addCategory: RequestHandler = async (request, response) => {
  const category = await categoryService.addCategory(request.body.name)
  response.status(201).json({ category })
}

export const renameCategory: RequestHandler = async (request, response) => {
  const category = await categoryService.renameCategory(
    request.params['id']!,
    request.body.name
  )
  response.status(200).json({ category })
}

export const removeCategory: RequestHandler = async (request, response) => {
  await categoryService.removeCategory(request.params['id']!)
  response.sendStatus(204)
}

export const updateResumeOrder: RequestHandler = async (request, response) => {
  const category = await categoryService.updateResumeOrder(
    request.params['id']!,
    request.body.resumes
  )
  response.status(200).json({ category })
}
