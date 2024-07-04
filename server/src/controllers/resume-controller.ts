import { type RequestHandler } from 'express'

import * as resumeService from '../services/resume-service'

export const getResumes: RequestHandler = async (_request, response) => {
  const resumes = await resumeService.getResumes()
  const uncategorized = resumes.find(
    (resume) => resume.name === 'Uncategorized'
  )
  const categorized = resumes.filter(
    (resume) => resume.name !== 'Uncategorized'
  )
  response.status(200).json({ uncategorized, categorized })
}

export const updateCategory: RequestHandler = async (request, response) => {
  const resume = await resumeService.updateCategory(
    request.params['id']!,
    request.body.categoryId,
    request.body.resumes
  )
  response.status(200).json({ resume })
}
