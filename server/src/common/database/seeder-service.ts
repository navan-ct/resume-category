import axios from 'axios'
import { type HydratedDocument } from 'mongoose'

import { ErrorMessages } from '../utils/constants'
import Category, { type ICategory } from './models/category'
import Resume from './models/resume'

const { RESUME_URL, ACCESS_KEY } = process.env

interface IResumeResponseData {
  record: Array<{
    name: string
    resume: string
  }>
}

export const seedCategory = async () => {
  const categoryCount = await Category.countDocuments()
  if (categoryCount) return
  const category = await Category.create({ name: 'Uncategorized' })
  return category
}

export const seedResume = async (category: HydratedDocument<ICategory>) => {
  if (!RESUME_URL || !ACCESS_KEY) {
    throw new Error(ErrorMessages.ENVIRONMENT_VARIABLE)
  }
  const resumeCount = await Resume.countDocuments()
  if (resumeCount) return

  // Get resumes from the external API.
  const headers = { 'X-Access-Key': ACCESS_KEY }
  const response = await axios.get<IResumeResponseData>(RESUME_URL, { headers })

  // Link between the resumes and the default category.
  const resumeDocuments = response.data.record.map((item) => ({
    name: item.name,
    url: item.resume,
    category: category._id
  }))
  const resumes = await Resume.create(resumeDocuments)
  category.resumes = resumes.map((resume) => resume._id)
  await category.save()

  return resumes
}
