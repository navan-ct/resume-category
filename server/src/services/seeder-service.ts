import axios from 'axios'
import { type Types } from 'mongoose'

import Category from '../models/category'
import Resume from '../models/resume'
import { ErrorMessages } from '../utils/constants'

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

export const seedResume = async (categoryId: Types.ObjectId) => {
  if (!RESUME_URL || !ACCESS_KEY) {
    throw new Error(ErrorMessages.ENVIRONMENT_VARIABLE)
  }

  const resumeCount = await Resume.countDocuments()
  if (resumeCount) return

  const headers = { 'X-Access-Key': ACCESS_KEY }
  const response = await axios.get<IResumeResponseData>(RESUME_URL, { headers })

  const documents = response.data.record.map((item) => ({
    name: item.name,
    url: item.resume,
    category: categoryId
  }))
  const resumes = await Resume.create(documents)
  return resumes
}
