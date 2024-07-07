import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

import { type StoreDispatch, type StoreState } from '.'
import { type ResponseError } from '../utils/types'

export interface IResume {
  _id: string
  name: string
  url: string
  category: string
}

export interface ICategory {
  _id: string
  name: string
  resumes: IResume[]
}

export interface IResumeState {
  uncategorized: ICategory
  categories: ICategory[]
  error: string | null
  isLoading: boolean
}

const initialState: IResumeState = {
  uncategorized: {
    _id: '',
    name: 'Uncategorized',
    resumes: []
  },
  categories: [],
  error: null,
  isLoading: true
}

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResumes(
      state,
      action: PayloadAction<Pick<IResumeState, 'uncategorized' | 'categories'>>
    ) {
      state.uncategorized = action.payload.uncategorized
      state.categories = action.payload.categories
    },

    moveResume(state, action: PayloadAction<IMoveResumePayload>) {
      const { resumeId, oldCategoryId, categoryId, atIndex } = action.payload

      const oldCategory =
        state.uncategorized._id === oldCategoryId
          ? state.uncategorized
          : state.categories.find((category) => category._id === oldCategoryId)
      const resume = oldCategory!.resumes.find((item) => item._id === resumeId)
      oldCategory!.resumes = oldCategory!.resumes.filter(
        (item) => item._id !== resumeId
      )

      const category =
        state.uncategorized._id === categoryId
          ? state.uncategorized
          : state.categories.find((category) => category._id === categoryId)
      resume!.category = category!._id
      category!.resumes.splice(atIndex, 0, resume!)
    },

    setError(state, action: PayloadAction<IResumeState['error']>) {
      state.error = action.payload
    },
    setIsLoading(state, action: PayloadAction<IResumeState['isLoading']>) {
      state.isLoading = action.payload
    }
  }
})

export const { setResumes, moveResume, setError, setIsLoading } =
  resumeSlice.actions

export const fetchResumes = () => async (dispatch: StoreDispatch) => {
  try {
    const response = await axios.get('/resume', {
      baseURL: import.meta.env.VITE_API_URL
    })
    dispatch(
      setResumes({
        uncategorized: response.data.uncategorized,
        categories: response.data.categories
      })
    )
  } catch (_error) {
    const error = _error as ResponseError
    dispatch(setError(error.response?.data?.message || error.message))
  } finally {
    dispatch(setIsLoading(false))
  }
}

export const selectUncategorized = (state: StoreState) => {
  return state.resume.uncategorized
}
export const selectCategories = (state: StoreState) => state.resume.categories
export const selectError = (state: StoreState) => state.resume.error
export const selectIsLoading = (state: StoreState) => state.resume.isLoading

export default resumeSlice.reducer

interface IMoveResumePayload {
  resumeId: string
  oldCategoryId: string
  categoryId: string
  atIndex: number
}
