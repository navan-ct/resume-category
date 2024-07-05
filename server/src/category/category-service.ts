import Category from '../common/database/models/category'
import Resume from '../common/database/models/resume'
import { ErrorMessages } from '../common/utils/constants'
import { HttpError } from '../common/utils/error'

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
