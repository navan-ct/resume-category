import { type RequestHandler } from 'express'

import * as resumeService from './resume-service'

export const getResumes: RequestHandler = async (_request, response, next) => {
  try {
    const resumes = await resumeService.getResumes()
    const uncategorized = resumes.find(
      (resume) => resume.name === 'Uncategorized'
    )
    const categories = resumes.filter(
      (resume) => resume.name !== 'Uncategorized'
    )
    response.status(200).json({ uncategorized, categories })
  } catch (error) {
    next(error)
  }
}

export const updateCategory: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const resume = await resumeService.updateCategory(
      request.params['id']!,
      request.body.categoryId,
      request.body.resumes
    )
    response.status(200).json({ resume })
  } catch (error) {
    next(error)
  }
}

export const batchUpdateCategory: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const resume = await resumeService.batchUpdateCategory(request.body)
    response.status(200).json({ resume })
  } catch (error) {
    next(error)
  }
}
