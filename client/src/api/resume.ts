import axios from 'axios'

export interface IUpdateResumeCategoryBody {
  categoryId: string
  resumes: string[]
}

export const updateResumeCategory = async (
  resumeId: string,
  body: IUpdateResumeCategoryBody
) => {
  try {
    await axios.patch(`/resume/${resumeId}`, body, {
      baseURL: import.meta.env.VITE_API_URL
    })
  } catch (error) {
    console.error(error)
  }
}
