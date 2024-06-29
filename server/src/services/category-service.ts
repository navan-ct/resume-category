import Category from '../models/category'
import { ErrorMessages } from '../utils/constants'
import { HttpError } from '../utils/error'

export const addCategory = async (name: string) => {
  const category = await Category.create({ name })
  return category.toJSON()
}

export const renameCategory = async (id: string, name: string) => {
  const category = await Category.findById(id)
  if (!category) throw new HttpError(ErrorMessages.CATEGORY_ID, 400)
  category.name = name
  await category.save()
  return category.toJSON()
}

export const removeCategory = async (id: string) => {
  await Category.findByIdAndDelete(id)
}
