import Category from '../models/category'
import Resume from '../models/resume'
import { ErrorMessages } from '../utils/constants'
import { HttpError } from '../utils/error'

export const getResumes = async () => {
  const resumes = await Resume.find()
  return resumes
}

export const updateCategory = async (resumeId: string, categoryId: string) => {
  const resume = await Resume.findById(resumeId)
  if (!resume) throw new HttpError(ErrorMessages.RESUME_ID, 400)
  const category = await Category.findById(categoryId)
  if (!category) throw new HttpError(ErrorMessages.CATEGORY_ID, 400)
  resume.category = category._id
  await resume.save()
  return resume.toJSON()
}
