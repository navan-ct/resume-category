import {
  useDispatch as _useDispatch,
  useSelector as _useSelector
} from 'react-redux'

import { type StoreDispatch, type StoreState } from '../store'

export const useDispatch = _useDispatch.withTypes<StoreDispatch>()
export const useSelector = _useSelector.withTypes<StoreState>()
