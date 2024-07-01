import { Types } from 'mongoose'

import Category from '../models/category'
import Resume from '../models/resume'
import { ErrorMessages } from '../utils/constants'
import { HttpError } from '../utils/error'

export const findCategoryByIdOrFail = async (id: string) => {
  const category = await Category.findById(id)
  if (!category) {
    throw new HttpError(ErrorMessages.CATEGORY_ID, 400)
  }
  return category
}

export const addCategory = async (name: string) => {
  const category = await Category.create({ name })
  return category.toJSON()
}

export const renameCategory = async (id: string, name: string) => {
  const category = await findCategoryByIdOrFail(id)
  category.name = name
  await category.save()
  return category.toJSON()
}

export const removeCategory = async (id: string) => {
  const category = await findCategoryByIdOrFail(id)

  // Move the category's resumes to the default category.
  const uncategorized = await Category.findOne({ name: 'Uncategorized' })
  uncategorized!.resumes = [...uncategorized!.resumes, ...category.resumes]

  // Update the resumes' category.
  await Resume.updateMany({ category: id }, { category: uncategorized!._id })
  await uncategorized!.save()

  await Category.findByIdAndDelete(id)
}

export const updateResumeOrder = async (id: string, resumes: string[]) => {
  const category = await findCategoryByIdOrFail(id)

  // Verify that only the order has changed and not the list itself.
  if (
    category.resumes.length !== resumes.length ||
    category.resumes.some((id) => !resumes.includes(id.toString()))
  ) {
    throw new HttpError(ErrorMessages.RESUME_LIST, 400)
  }

  category.resumes = resumes.map((id) => new Types.ObjectId(id))
  await category.save()
  return category
}
