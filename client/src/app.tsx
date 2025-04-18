import { useEffect } from 'react'

import Category from './components/category'
import AddIcon from './components/icons/add'
import Navbar from './components/navbar'
import { useDispatch, useSelector } from './hooks/redux'
import {
  addCategory,
  fetchResumes,
  selectCategories,
  selectIsLoading,
  selectUncategorized
} from './store/resume-slice'

const App = () => {
  const dispatch = useDispatch()
  const uncategorized = useSelector(selectUncategorized)
  const categories = useSelector(selectCategories)
  const isLoading = useSelector(selectIsLoading)

  useEffect(() => {
    dispatch(fetchResumes())
  }, [dispatch])

  const handleAdd = () => {
    const name = prompt('Category Name')
    if (name) {
      dispatch(addCategory(name))
    }
  }

  return (
    <div className="flex h-full justify-center">
      <div className="flex h-full w-full max-w-5xl gap-x-4 px-10">
        <div className="flex h-full w-[calc(40%-0.5rem)] flex-shrink-0 flex-col pb-8 pt-5">
          <Navbar />
          <Category
            className="flex-grow"
            {...uncategorized}
            columns={2}
            isDeletable={false}
          />
        </div>

        <div className="hide-scrollbar flex h-full w-[calc(60%-0.5rem)] flex-shrink-0 flex-col gap-y-4 overflow-y-scroll pt-[4.125rem]">
          <button
            className="group flex h-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-[3px] border-dashed border-neutral-200"
            onClick={handleAdd}
            disabled={isLoading}
          >
            <AddIcon className="h-6 w-6 fill-neutral-400 transition-all group-hover:fill-neutral-500" />
          </button>

          {categories.map((category) => (
            <Category key={category._id} {...category} columns={3} />
          ))}

          <div className="h-4 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}

export default App
