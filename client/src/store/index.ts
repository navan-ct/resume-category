import { configureStore } from '@reduxjs/toolkit'

import resumeReducer from './resume-slice'

const store = configureStore({
  reducer: {
    resume: resumeReducer
  }
})

export type StoreState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch

export default store
