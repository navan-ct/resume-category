import { useEffect } from 'react'

import Navbar from './components/navbar'
import { useDispatch, useSelector } from './hooks/redux'
import {
  fetchResumes,
  selectCategories,
  selectError,
  selectIsLoading,
  selectUncategorized
} from './store/resume-slice'

const App = () => {
  const dispatch = useDispatch()
  const uncategorized = useSelector(selectUncategorized)
  const categories = useSelector(selectCategories)
  const error = useSelector(selectError)
  const isLoading = useSelector(selectIsLoading)

  useEffect(() => {
    dispatch(fetchResumes())
  }, [dispatch])

  console.log(uncategorized, categories, error, isLoading)

  return (
    <div>
      <Navbar />
    </div>
  )
}

export default App
