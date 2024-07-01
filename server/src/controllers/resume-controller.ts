import { type RequestHandler } from 'express'

import * as resumeService from '../services/resume-service'

export const getResumes: RequestHandler = async (_request, response) => {
  const resumes = await resumeService.getResumes()
  response.status(200).json({ resumes })
}

export const updateCategory: RequestHandler = async (request, response) => {
  const resume = await resumeService.updateCategory(
    request.params['id']!,
    request.body.categoryId
  )
  response.status(200).json({ resume })
}
