import axios from 'axios'

const config = {
  baseURL: import.meta.env.VITE_API_URL
}

export const fetchResumes = async () => {
  try {
    const response = await axios.get('/resume', config)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export interface IUpdateResumeCategoryBody {
  categoryId: string
  resumes: string[]
}

export const updateResumeCategory = async (
  resumeId: string,
  body: IUpdateResumeCategoryBody
) => {
  try {
    await axios.patch(`/resume/${resumeId}`, body, config)
  } catch (error) {
    console.error(error)
  }
}

export interface IAddCategoryBody {
  name: string
}

export const addCategory = async (body: IAddCategoryBody) => {
  try {
    const response = await axios.post('/category', body, config)
    return response.data.category
  } catch (error) {
    console.error(error)
  }
}

export const removeCategory = async (categoryId: string) => {
  try {
    await axios.delete(`/category/${categoryId}`, config)
  } catch (error) {
    console.error(error)
  }
}
