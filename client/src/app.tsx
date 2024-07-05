import { useEffect } from 'react'

import Category from './components/category'
import Navbar from './components/navbar'
import { useDispatch, useSelector } from './hooks/redux'
import {
  fetchResumes,
  selectCategories,
  selectUncategorized
} from './store/resume-slice'

const App = () => {
  const dispatch = useDispatch()
  const uncategorized = useSelector(selectUncategorized)
  const categories = useSelector(selectCategories)

  useEffect(() => {
    dispatch(fetchResumes())
  }, [dispatch])

  return (
    <div className="flex h-full justify-center">
      <div className="flex h-full w-full max-w-5xl gap-x-4 px-10 pt-5">
        <div className="flex h-full w-[calc(40%-0.5rem)] flex-shrink-0 flex-col pb-8">
          <Navbar />
          <Category
            className="flex-grow"
            label="Uncategorized"
            resumes={uncategorized}
            columns={2}
          />
        </div>

        <div className="flex h-full w-[calc(60%-0.5rem)] flex-shrink-0 flex-col gap-y-4 pt-[2.875rem]">
          {categories.map((category) => (
            <Category
              key={category._id}
              label={category.name}
              resumes={category.resumes}
              columns={3}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
