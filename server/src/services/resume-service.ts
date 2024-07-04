import { Types, type HydratedDocument } from 'mongoose'

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

export const updateCategory = async (
  resumeId: string,
  categoryId: string,
  resumes: string[]
) => {
  const resume = await findResumeByIdOrFail(resumeId)

  const hasCategoryChanged = !resume.category._id.equals(categoryId)
  const category = hasCategoryChanged
    ? await findCategoryByIdOrFail(categoryId)
    : resume.category

  // Remove the resume from its category.
  if (hasCategoryChanged) {
    const category = resume.category
    category.resumes = category.resumes.filter((resume) => {
      return !resume.equals(resumeId)
    })
    await category.save()
  }

  // Add the resume to the new category.
  category.resumes = resumes.map((id) => new Types.ObjectId(id))
  await category.save()

  resume.category = category
  await resume.save()
  return resume.toJSON()
}
