import { type HydratedDocument } from 'mongoose'

import Category, { type ICategory } from '../models/category'
import Resume from '../models/resume'
import { ErrorMessages } from '../utils/constants'
import { HttpError } from '../utils/error'
import { findCategoryByIdOrFail } from './category-service'

export const findResumeByIdOrFail = async (id: string) => {
  const resume = await Resume.findById(id).populate<{
    category: HydratedDocument<ICategory>
  }>('category')
  if (!resume) {
    throw new HttpError(ErrorMessages.RESUME_ID, 400)
  }
  return resume
}

export const getResumes = async () => {
  const resumes = await Category.find().lean().populate('resumes')
  return resumes
}

export const updateCategory = async (resumeId: string, categoryId: string) => {
  const resume = await findResumeByIdOrFail(resumeId)
  const category = await findCategoryByIdOrFail(categoryId)

  const currentCategory = resume.category
  currentCategory.resumes = currentCategory.resumes.filter((resume) => {
    return !resume.equals(resumeId)
  })
  await currentCategory.save()

  category.resumes = [...category.resumes, resume._id]
  await category.save()

  resume.category = category
  await resume.save()
  return resume.toJSON()
}
