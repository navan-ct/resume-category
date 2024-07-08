import { Types, type HydratedDocument } from 'mongoose'

import { findCategoryByIdOrFail } from '../category/category-service'
import Category, { type ICategory } from '../common/database/models/category'
import Resume from '../common/database/models/resume'
import { ErrorMessages } from '../common/utils/constants'
import { HttpError } from '../common/utils/error'

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

const draftUpdateCategory = async (
  resumeId: string,
  categoryId: string,
  resumes: string[]
) => {
  const resume = await findResumeByIdOrFail(resumeId)

  const hasCategoryChanged = !resume.category._id.equals(categoryId)
  const category = hasCategoryChanged
    ? await findCategoryByIdOrFail(categoryId)
    : resume.category

  let currentCategory: HydratedDocument<ICategory> | null = null
  if (hasCategoryChanged) {
    // Remove the resume from its current category.
    currentCategory = resume.category
    currentCategory.resumes = currentCategory.resumes.filter((resume) => {
      return !resume.equals(resumeId)
    })
    await currentCategory.save()

    resume.category = category
    await resume.save()
  }

  // Add the resume to the new category and/or update the order.
  category.resumes = resumes.map((id) => new Types.ObjectId(id))
  await category.save()

  return { resume, currentCategory, category }
}

export const updateCategory = async (
  resumeId: string,
  categoryId: string,
  resumes: string[]
) => {
  const { resume, currentCategory, category } = await draftUpdateCategory(
    resumeId,
    categoryId,
    resumes
  )
  if (currentCategory) {
    currentCategory.save()
    resume.save()
  }
  category.save()
  return resume.toJSON()
}

interface IBatchUpdateCategoryItem {
  resumeId: string
  categoryId: string
  resumes: string[]
}

export const batchUpdateCategory = async (data: IBatchUpdateCategoryItem[]) => {
  const resumes: Awaited<ReturnType<typeof findResumeByIdOrFail>>[] = []
  const categories: Record<string, HydratedDocument<ICategory>> = {}

  for (const item of data) {
    const { resume, currentCategory, category } = await draftUpdateCategory(
      item.resumeId,
      item.categoryId,
      item.resumes
    )
    if (currentCategory) {
      categories[currentCategory.id] = currentCategory
      resumes.push(resume)
    }
    categories[category.id] = category
  }

  await Resume.bulkSave(resumes)
  await Category.bulkSave(Object.values(categories))

  return resumes.map((item) => item.toJSON())
}
