import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { type StoreDispatch, type StoreState } from '.'
import * as api from '../api/resume'
import { StorageKey } from '../utils/constants'
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
  pendingRequest: Promise<void> | null
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
  pendingRequest: null,
  error: null,
  isLoading: false
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

      // Remove the resume from its current category.
      const oldCategory =
        state.uncategorized._id === oldCategoryId
          ? state.uncategorized
          : state.categories.find((category) => category._id === oldCategoryId)
      const resume = oldCategory!.resumes.find((item) => item._id === resumeId)
      oldCategory!.resumes = oldCategory!.resumes.filter(
        (item) => item._id !== resumeId
      )

      // Add the resume to the new category at the given position.
      const category =
        state.uncategorized._id === categoryId
          ? state.uncategorized
          : state.categories.find((category) => category._id === categoryId)
      resume!.category = category!._id
      category!.resumes.splice(atIndex, 0, resume!)
    },

    addCategory(state, action: PayloadAction<ICategory>) {
      state.categories = [...state.categories, action.payload]
    },

    removeCategory(state, action: PayloadAction<string>) {
      const category = state.categories.find(
        (category) => category._id === action.payload
      )

      // Move the resumes in the category to the default category.
      state.uncategorized.resumes = [
        ...state.uncategorized.resumes,
        ...category!.resumes
      ]

      state.categories = state.categories.filter(
        (category) => category._id !== action.payload
      )
    },

    setPendingRequest(
      state,
      action: PayloadAction<IResumeState['pendingRequest']>
    ) {
      state.pendingRequest = action.payload
    },

    setError(state, action: PayloadAction<IResumeState['error']>) {
      state.error = action.payload
    },
    setIsLoading(state, action: PayloadAction<IResumeState['isLoading']>) {
      state.isLoading = action.payload
    }
  }
})

export const {
  setResumes,
  moveResume,
  addCategory: addCategoryAction,
  removeCategory,
  setPendingRequest,
  setError,
  setIsLoading
} = resumeSlice.actions

export const fetchResumes = () => async (dispatch: StoreDispatch) => {
  try {
    dispatch(setIsLoading(true))
    const { uncategorized, categories } = await api.fetchResumes()
    dispatch(setResumes({ uncategorized, categories }))
  } catch (_error) {
    const error = _error as ResponseError
    console.error(error)
    dispatch(setError(error.response?.data?.message || error.message))
  } finally {
    dispatch(setIsLoading(false))
  }
}

export const addCategory =
  (name: string) => async (dispatch: StoreDispatch) => {
    try {
      dispatch(setIsLoading(true))
      const category = await api.addCategory({ name })
      if (category) {
        dispatch(addCategoryAction(category))
      }
    } catch (_error) {
      const error = _error as ResponseError
      console.error(error)
      dispatch(setError(error.response?.data?.message || error.message))
    } finally {
      dispatch(setIsLoading(false))
    }
  }

export const removeCategoryById =
  (id: string) => async (dispatch: StoreDispatch) => {
    try {
      dispatch(setIsLoading(true))
      dispatch(removeCategory(id))
      await api.removeCategory(id)
    } catch (_error) {
      const error = _error as ResponseError
      console.error(error)
      dispatch(setError(error.response?.data?.message || error.message))
    } finally {
      dispatch(setIsLoading(false))
    }
  }

export const updateResumeCategory =
  () => async (dispatch: StoreDispatch, getState: () => StoreState) => {
    try {
      // Wait for any pending request to be fulfilled.
      const { pendingRequest } = getState().resume
      if (pendingRequest) {
        await pendingRequest
      }

      dispatch(setIsLoading(true))
      const data = JSON.parse(
        localStorage.getItem(StorageKey.REQUEST_DATA) || '{}'
      )
      const request = api.updateResumeCategory(Object.values(data))

      // Block any new requests till this one is fulfilled.
      dispatch(setPendingRequest(request))
      await request
      dispatch(setPendingRequest(null))

      localStorage.removeItem(StorageKey.REQUEST_DATA)
    } catch (_error) {
      const error = _error as ResponseError
      console.error(error)
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
